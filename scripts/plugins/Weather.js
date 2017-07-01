/* @flow */
'use strict';

/**
 * Weather plugin. Also used for day/night cycle.
 * @property {number} dayOrNight DAY or NIGHT.
 * @property {object} daySub
 * @property {objecy} nightSub
 */
CivClicker.plugins.Weather = (() => {

  const DAY = 0;
  const NIGHT = 1;

  let toggle = false;

  return new (class WeatherPlugin {

    constructor() {
      this.dayOrNight = DAY;
      this.daySub = null;
      this.nightSub = null;
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
