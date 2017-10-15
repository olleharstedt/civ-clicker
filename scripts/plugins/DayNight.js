/* @flow */
'use strict';

/**
 * Day and night plugin.
 */
CivClicker.plugins.DayNight = (() => {

  // Constants for day and night.
  const DAY = 0;
  const NIGHT = 1;

  /** 
   * @type {number} Length of day (and night) in number of ticks (seconds).
   * Default is overwritten by server config.
   */
  const DEFAULTLENGTHOFDAY = 60;

  return new (class DayNightPlugin {

    constructor() {
      this.time = 0;
      this.tickSub = null;
      this.dayOrNight = DAY;
      this.lengthOfDay = DEFAULTLENGTHOFDAY;
    }

    /**
     * Switch between day or night.
     */
    switch() {
      this.dayOrNight = 1 - this.dayOrNight;

      if (this.dayOrNight == DAY) {
        CivClicker.Events.publish('daynight.day.begin');
      } else if (this.dayOrNight == NIGHT) {
        CivClicker.Events.publish('daynight.night.begin');
      } else {
        // Not possible.
        throw 'Internal error - neither day or night.';
      }
    }

    /**
     * To test weather simulation etc.
     */
    multipleSwitch(n) {
      for (let i = 0; i < n; i++) {
        this.switch();
      }
    }

    /**
     * The DayNight system ticks each game loop tick.
     */
    tick() {
      this.time++;
      if (this.time > this.lengthOfDay) {
        this.time = 0;
        this.switch();
      }
    }

    /**
     * Initialize the plugin.
     */
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });
      if (serverSettings.weather && serverSettings.weather.lengthOfDay) {
        this.lengthOfDay = serverSettings.weather.lengthOfDay;
        console.log('lengthOfDay initialised to ' + this.lengthOfDay);
      }

      // Make it day after init.
      this.tickSub = CivClicker.Events.subscribe('global.pluginInitDone', () => {
        CivClicker.Events.publish('daynight.day.begin');
      });

    }

    /**
     * Remove plugin.
     */
    unload() {
      if (this.tickSub) {
        this.tickSub.remove();
      }
    }

  });
})();
