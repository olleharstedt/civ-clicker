/* @flow */
'use strict';

/**
 * Plugin for animal population simulation.
 */
CivClicker.plugins.Animals = (() => {

  /**
   * @var {number} Amount of wolves alive.
   */
  let wolves = 0;

  /**
   * @var {number} Amount of bunnies alive.
   */
  let bunnies = 0;

  // Math. See animal test 1 in animal_test.js.
  let r = 1.3;
  let s = 4;
  let u = 0.7;
  let v = 1.6;
  let a = 2;
  let K = 3;
  let h = 0.1;
  let P = 0.7;
  let Q = 0.3;
  let dP = null;
  let dQ = null;
  let huntingBunnies = 0;
  let data1 = [];
  let data2 = [];
  data1.push({x: 0, y: P});
  data2.push({x: 0, y: Q});
  
  return new (class AnimalsPlugin {

    constructor() {
    }

    tick() {
      // Tick the equation one t forward.
      // TODO: Too slow/fast?
      dP = (r * (1 - P / K) - (s * Q) / (a + P) - huntingBunnies / (a + P)) * P * h;
      dQ = (-u + (v * P) / (a + P)) * Q * h;
      P += dP;
      Q += dQ;
      bunnies = P;
      wolves = Q;
      data1.push({x: t, y: P});
      data2.push({x: t, y: Q});
    }

    init() {
      this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        this.tick();
      });
      this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        this.tick();
      });
    }

    /**
     * Initialize the plugin and subscribe to events.
     */
    unload() {
      this.daySub.remove();
      this.nightSub.remove();
    }

    /**
     * @param {number} amount
     */
    killWolf(amount) {
    }

    /**
     * @param {number} amount
     */
    killBunny(amount) {
    }
  });
})();
