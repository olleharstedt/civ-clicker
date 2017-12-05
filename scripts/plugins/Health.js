/* @flow */
'use strict';

/**
 * Deals with population health.
 * @property {number} temperature - Fetched from the weather plugin.
 */
CivClicker.plugins.Health = (() => {
  return new (class HealthPlugin {

    /**
     *
     */
    constructor() {
      this.temperature = 30; // start at a warm temp
      this.isNight = false; // start at day
    }

    /**
     * Tick.
     */
    tick() {
      /*
      / Check temperature
      / Check heat in society.
      / If night, cold and rainy, make someone sick possibly.
      */
      let chance = Math.floor(Math.random() * 1000) + 1; // 0.1% chance
      if(this.temperature < 15 /* CELSIUS - if Farinheit then < 60*/ && (chance === 1000 || this.isNight)) {
        // make a worker sick
      }
    }

    /**
     * Init plugin.
     */
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });
      this.temperatureSub = CivClicker.Events.subscribe('weather.temperature', (temp) => {
        this.temperature = temp;
      });
      // Listen to the DayNight plugin.
      this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        this.isNight = false;
      });

      this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        this.isNight = true;
      });
    }

  });
})();
