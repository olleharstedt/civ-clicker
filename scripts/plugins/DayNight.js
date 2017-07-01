/* @flow */
'use strict';

/**
 * Day and night plugin.
 */
CivClicker.plugins.DayNight = (() => {

  // Constants for day and night.
  const DAY = 0;
  const NIGHT = 1;

  /** @type {number} Length of day (and night) in number of ticks (seconds). */
  const LENGTHOFDAY = 5;

  return new (class DayNightPlugin {

    constructor() {
      this.time = 0;
      this.tickSub = null;
      this.dayOrNight = DAY;
    }

    /**
     * The DayNight system ticks each game loop tick.
     */
    tick() {
      this.time++;
      if (this.time > LENGTHOFDAY) {
        this.time = 0;

        // Switch between day or night.
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
    }

    /**
     * Initialize the plugin.
     */
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
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
