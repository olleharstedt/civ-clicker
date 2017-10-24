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
      this.temperature = 0;
    }

    /**
     * Tick.
     */
    tick() {
      // Check temperature
      // Check heat in society.
      // If night, cold and rainy, make someone sick possibly.
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
    }

  });
})();
