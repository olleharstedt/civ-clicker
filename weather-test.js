$(function () {

  // NB: Also in Weather.js.
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

  let tempDry = (function() {
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


  // Return number of rain streaks.
  function getNumberOfStreaks(list) {
    let streaks = 0;
    let isStreak = true;
    let streakLength;
    let streakLengths = [];
    for (let i = 0; i < list.length; i++) {
      let rain = list[i];
      if (rain && list[i - 1]) {
        if (!isStreak) {
          streaks++;
        }
        isStreak = true;
        streakLength++;
      } else {
        isStreak = false;
        if (streakLength > 0) {
          streakLengths.push(streakLength);
        }
        streakLength = 0;
      }
    }
    return streakLengths;
  }

  let weatherList = [];
  const totalDays = 100;
  let daysList = [];
  let precList= [];
  let totalPrec = 0;
  let precSeasonList = [];
  let cosList = [];
  let wetDays = 0;
  let dryDays = 0;
  let tempList = [];
  for (let i = 0; i < totalDays; i++) {
    daysList.push(i);
    CivClicker.plugins.Weather.decideWetOrDry();
    if (CivClicker.plugins.Weather.wetOrDry == 2) {
      // 2 == DRY
      weatherList.push(0);
      dryDays++;
    } else {
      // 3 == WET
      weatherList.push(1);
      wetDays++;
    }
    const prec = CivClicker.plugins.Weather.getPrecipitation();
    totalPrec += prec;
    precList.push(prec);
    const cos = Math.cos(i / (50/Math.PI)) /2 + 1;
    cosList.push(cos);
    precSeasonList.push(prec * cos);
    tempList.push(tempDry(i));
  }

  var streaks = getNumberOfStreaks(weatherList);
  document.getElementById('total-days').innerHTML = totalDays;
  document.getElementById('streaks').innerHTML = streaks.length;
  document.getElementById('wet-days').innerHTML = dryDays;
  document.getElementById('dry-days').innerHTML = wetDays;

  streaks.sort((a, b) => { return b - a;});
  let ctx = document.getElementById('streaks').getContext('2d');
  let myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: streaks,
      datasets: [
        {
          label: 'Length of streak',
          data: streaks
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Gamma
  let list = [];
  let listb = [];
  let a = 3.5;
  let b = 4;
  for (let i = 0; i < 1; i += 0.01) {
    list.push(CivClicker.plugins.Weather.getGammaDistribution(i, a, b));
    listb.push(i);
  }
  ctx = document.getElementById('gamma').getContext('2d');
  gammaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: listb,
      datasets: [
        {
          label: 'Gamma distribution function',
          data: list
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Precipitation during 100 days above.
  const totalPrecElem = document.getElementById('totalPrec');
  totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('prec').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysList,
      datasets: [
        {
          label: 'Precipitation during 100 "days"',
          data: precList
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  // Seasonal precipitation during 100 days above.
  //const totalPrecElem = document.getElementById('totalPrec');
  //totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('seasonalPrec').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysList,
      datasets: [
        {
          label: 'Seasonal precipitation during 100 "days"',
          data: precSeasonList
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  ctx = document.getElementById('temperature').getContext('2d');
  let _tmp = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysList,
      datasets: [
        {
          label: 'Temperature',
          data: tempList
        }
      ]
    },
    options: {
      'label': 'bla'
    }
  });

  /*
  // Seasonal precipitation during 100 days above.
  //const totalPrecElem = document.getElementById('totalPrec');
  //totalPrecElem.innerHTML = totalPrec;
  ctx = document.getElementById('cos').getContext('2d');
  precChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cosList,
      datasets: [
      {
        label: 'Cos',
        data: cosList
      }
      ]
    },
    options: {
      'label': 'bla'
    }
  });
  */
});

