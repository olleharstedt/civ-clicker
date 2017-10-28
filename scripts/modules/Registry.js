/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Global registry module..
 */
CivClicker.Registry = (() => {

  /**
   * @property {number} heat Heat of civilization in celcius.
   */
  let heat  = 0;

  /**
   * @property {number} light 0 to 100.
   */
  let light = 0;

  /**
   * @property {number} temperature Weather temperature
   */
  let temperature = 0;

  /**
   * @property {boolean} isNight True if it's night.
   */
  let isNight = false;

  CivClicker.Events.subscribe('weather.temperature', (temp) => {
    temperature = temp;
  });

  // Listen to the DayNight plugin.
  CivClicker.Events.subscribe('daynight.day.begin', () => {
    isNight = false;
  });

  CivClicker.Events.subscribe('daynight.night.begin', () => {
    isNight = true;
  });

  return new (class Registry {
    constructor() {
    }

    /**
     * This must happen FIRST on every game loop tick!
     */
    beforeTick() {
      // TODO: Add moon cycle for light.
      if (isNight) {
        light = 0;
      } else {
        light = 100;
      }

      // TODO: Make heat change more slowly towards surrounding temperature.
      heat = temperature;
    }

    /**
     * This must happen AFTER everything on every game loop tick!
     */
    afterTick() {
    }

    /**
     * @param {number} h
     */
    increaseHeat(h) {
      heat += h;
    }

    /**
     * @param {number} h
     */
    decreaseHeat(h) {
      heat -= h;
    }

    /**
     * @return {number}
     */
    getHeat() {
      return heat;
    }

  });
})();
