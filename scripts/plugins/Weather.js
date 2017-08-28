/* @flow */
'use strict';

/**
 * Weather plugin. Also used for day/night icons.
 * @property {number} dayOrNight DAY or NIGHT.
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

  let toggle = false;

  return new (class WeatherPlugin {

    constructor() {
      this.dayOrNight = DAY;
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

    /**
     * The weather system ticks each game loop tick.
     */
    tick() {
      let msg = null;
      let icon = null;
      $('#weather-ul').on('show.bs.tooltip', () => { toggle = true; });
      $('#weather-ul').on('hide.bs.tooltip', () => { toggle = false; });

      if (this.dayOrNight == DAY) {
        icon = 'wi-day-sunny';
        msg = 'Sunny day';
      } else if (this.dayOrNight == NIGHT) {
        icon = 'wi-night-clear';
        msg = 'Clear night';
      }

      $('#weather-icon').attr('class', 'wi ' + icon);
      $('#weather-ul').attr('title', msg).tooltip('fixTitle');

      if (toggle) {
        $('.tooltip-inner').html(msg);
      }

      if (this._decideTick > 9) {
        this._decideTick = 0;
        this.decideWetOrDry();
      } else {
        this._decideTick++;
      }
    }

    /**
     * Initialize the plugin.
     */
    init() {
      // Listen to the DayNight plugin.
      this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        this.dayOrNight = DAY;
      });
      this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        this.dayOrNight = NIGHT;
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
    }

  });
})();
