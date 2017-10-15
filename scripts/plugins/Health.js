/* @flow */
'use strict';

/**
 * Deals with population health.
 */
CivClicker.plugins.Health = (() => {
  return new (class HealthPlugin {

    /**
     *
     */
    constructor() {
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
     *
     */
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });
    }

  });
})();
