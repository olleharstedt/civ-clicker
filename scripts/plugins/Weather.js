/* @flow */
//'use strict';

/**
 * Weather plugin. Also used for day/night icons.
 * @property {number} dayOrNight DAY or NIGHT.
 * @property {number} dayOfYear Day of year
 * @property {object} daySub
 * @property {objecy} nightSub
 * @property {number} wetOrDry Either WET or DRY.
 * @property {number} yesterdayWetOrDry Either WET or DRY.
 */
CivClicker.plugins.Weather = (() => {

  const DAY = 0;
  const NIGHT = 1;

  const DRY = 2;
  const WET = 3;

  /**
   * Number of days in one year.
   */
  const DAYSINYEAR = 100;

  /**
   * Number of days in one month.
   */
  const DAYSOFMONTH = 10;

  let toggle = false;

  // view-source:http://www.math.ucla.edu/~tom/distributions/gamma.html
  // Gamma function for daily precipitation.
  function LogGamma(Z) {
    with (Math) {
      var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
      var LG= (Z-.5)*Math.log(Z+4.5)-(Z+4.5)+Math.log(S*2.50662827465);
    }
    return LG;
  }
  function Gcf(X,A) {        // Good for X>A+1
    with (Math) {
      var A0=0;
      var B0=1;
      var A1=1;
      var B1=X;
      var AOLD=0;
      var N=0;
      while (Math.abs((A1-AOLD)/A1)>.00001) {
        AOLD=A1;
        N=N+1;
        A0=A1+(N-A)*A0;
        B0=B1+(N-A)*B0;
        A1=X*A0+N*A1;
        B1=X*B0+N*B1;
        A0=A0/B1;
        B0=B0/B1;
        A1=A1/B1;
        B1=1;
      }
      var Prob=Math.exp(A*Math.log(X)-X-LogGamma(A))*A1;
    }
    return 1-Prob;
  }
  function Gser(X,A) {        // Good for X<A+1.
    with (Math) {
      var T9=1/A;
      var G=T9;
      var I=1;
      while (T9>G*.00001) {
        T9=T9*X/(A+I);
        G=G+T9;
        I=I+1;
      }
      G=G*Math.exp(A*Math.log(X)-X-LogGamma(A));
    }
    return G;
  }
  function normalcdf(X) {   //HASTINGS.  MAX ERROR = .000001
    const T=1/(1+.2316419*Math.abs(X));
    const D=.3989423*Math.exp(-X*X/2);
    let Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
    if (X>0) {
      Prob=1-Prob;
    }
    return Prob;
  }
  function Gammacdf(x,a) {
    var GI;
    if (x<=0) {
      GI=0;
    } else if (a>200) {
      const z=(x-a)/Math.sqrt(a);
      const y=normalcdf(z);
      const b1=2/Math.sqrt(a);
      const phiz=.39894228*Math.exp(-z*z/2);
      const w=y-b1*(z*z-1)*phiz/6;  //Edgeworth1
      const b2=6/a;
      const u=3*b2*(z*z-3)+b1*b1*(z^4-10*z*z+15);
      GI=w-phiz*z*u/72;        //Edgeworth2
    } else if (x<a+1) {
      GI=Gser(x,a);
    } else {
      GI=Gcf(x,a);
    }
    return GI;
  }
  function compute(X, A, B) {
    if (A<=0) {
      throw 'alpha must be positive';
    } else if (B<=0) {
      throw 'beta must be positive';
    }
    let Prob=Gammacdf(X/B,A);
    Prob=Math.round(Prob*100000)/100000;
    return Prob;
  }

  /**
   * Normal distribution.
   * From: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
   * @return {function}
   */
  function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
      var y1;
      if(use_last) {
        y1 = y2;
        use_last = false;
      } else {
        var x1, x2, w;
        do {
          x1 = 2.0 * Math.random() - 1.0;
          x2 = 2.0 * Math.random() - 1.0;
          w  = x1 * x1 + x2 * x2;               
        } while( w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w))/w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
      }

      var retval = mean + stdev * y1;
      if(retval > 0) 
        return retval;
      return -retval;
    };
  }

  /**
   * Get temperature of a dry day.
   * @param {number} date Day of year
   * @return {number}
   */
  let getDryTemperature = (function() {
    let A = gaussian(6.83, 0.785);
    let B = gaussian(10.08, 0.595);
    const C = 111.8;
    let D = gaussian(-0.545, 0.693);
    const E = 130.91;

    return function(date) {
      return A() 
        + (B() * Math.sin((date - C) * ((2 * Math.PI) / 100)))
        + (D() * Math.sin((date - E) * ((2 * Math.PI) / 50)))
      ;
    };

  })();

  return new (class WeatherPlugin {

    constructor() {
      this.dayOrNight = DAY;
      this.dayOfYear = 1;
      this.daySub = null;
      this.nightSub = null;

      this.wetOrDry = DRY;
      this.yesterdayWetOrDry = DRY;
      this._decideTick = 0;
    }

    /**
     * Decide if this day is wet or dry using Markov chain logic.
     * Run each tick, but only decided each 10nth tick.
     */
    decideWetOrDry() {
      const rand = Math.random();
      if (this.yesterdayWetOrDry == WET) {
        if (rand > 0.5) {
          this.wetOrDry = WET;
        } else {
          this.wetOrDry = DRY;
        }
      } else if (this.yesterdayWetOrDry == DRY) {
        if (rand > 0.6) {
          this.wetOrDry = WET;
        } else {
          this.wetOrDry = DRY;
        }
      }

      this.yesterdayWetOrDry = this.wetOrDry;
      CivClicker.Events.publish('weather.wetOrDry', this.wetOrDry == WET ? 'wet' : 'dry');
    }

    getGammaDistribution(x, a, b) {
      return compute(x, a, b);
    }

    /**
     * Get amount of precipitation for this day.
     * @return {number} Mm of water.
     */
    getPrecipitation() {
      const rand = Math.random();
      const a = 3.5;
      const b = 4;
      if (this.wetOrDry == WET) {
        return this.getGammaDistribution(rand, a, b) * 100000;
        //return Math.pow(rand, 10);
      } else {
        return 0;
      }
    }

    /**
     * The weather system ticks each game loop tick.
     */
    tick() {
      let msg = null;
      let icon = null;
      $('#weather-ul').on('show.bs.tooltip', () => { toggle = true; });
      $('#weather-ul').on('hide.bs.tooltip', () => { toggle = false; });

      if (this.dayOrNight == DAY) {
        if (this.precipitation > 0) {
          icon = 'wi-day-rain';
          msg = 'Rainy day';
        } else {
          icon = 'wi-day-sunny';
          msg = 'Sunny day';
        }
      } else if (this.dayOrNight == NIGHT) {
        if (this.precipitation > 0) {
          icon = 'wi-night-alt-rain';
          msg = 'Rainy night';
        } else {
          icon = 'wi-night-clear';
          msg = 'Clear night';
        }
      }

      $('#weather-icon').attr('class', 'wi ' + icon);
      $('#weather-ul').attr('title', msg).tooltip('fixTitle');

      if (toggle) {
        $('.tooltip-inner').html(msg);
      }

      /*
      if (this._decideTick > 9) {
        this._decideTick = 0;
        this.decideWetOrDry();
      } else {
        this._decideTick++;
      }
      */

      // If temperature happens to be not set, set it now.
      if (this.temperature === null) {
        this.temperature = parseInt(getDryTemperature(this.dayOfYear));
      }

      // Set temperature to GUI.
      $('#temperature').html(this.temperature);

      // Publish temperature to anyone who wants to know
      CivClicker.Events.publish('weather.temperature', this.temperature);
    }

    /**
     * Increase day with one and wrap it around if it's new year.
     */
    increaseDay() {
      this.dayOfYear++;
      if (this.dayOfYear > DAYSINYEAR) {
        this.dayOfYear = 1;
      }
    }

    /**
     * Initialize the plugin and subscribe to events.
     */
    init() {

      // Listen to the DayNight plugin.
      this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        this.dayOrNight = DAY;
        this.decideWetOrDry();
        this.increaseDay();
        this.temperature = parseInt(getDryTemperature(this.dayOfYear));
        this.precipitation = this.getPrecipitation();
      });

      this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        this.dayOrNight = NIGHT;
        this.decideWetOrDry();
        this.temperature = parseInt(getDryTemperature(this.dayOfYear));
        this.precipitation = this.getPrecipitation();
      });

      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });
    }

    /**
     * Remove plugin.
     */
    unload() {
      this.daySub.remove();
      this.nightSub.remove();
      this.tickSub.remove();
    }

  });
})();
