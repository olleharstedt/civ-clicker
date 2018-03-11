/* @flow */
'use strict';

/**
 * Plugin for animal population simulation.
 */
CivClicker.plugins.Animals = (() => {

  /**
   * @var {number} Amount of wolves alive. Defined in config.json.
   */
  let wolves = null;

  /**
   * @var {number} Amount of bunnies alive. Defined in config.json.
   */
  let bunnies = null;

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
  let t = 0;
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
      t++;
      data1.push({x: t, y: P});
      data2.push({x: t, y: Q});
      //console.log('bunnies', P);
      //console.log('wolves', Q);

      // Remove data when too big.
      if (data1.length > 10000) {
        data1.shift();
      }
      if (data2.length > 10000) {
        data2.shift();
      }
    }

    /**
     * @param {object} options
     */
    init(options) {

      wolves  = options.wolves;
      bunnies = options.bunnies;

      //this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        //this.tick();
      //});
      //this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        //this.tick();
      //});
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });

      this.dataSub = CivClicker.Events.subscribe('sidemenu.data', () => {
        console.log('clicked data');
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
     * @return {number}
     */
    getWolves() {
      return wolves;
    }

    /**
     * @param {number} amount
     */
    killBunny(amount) {
    }

    /**
     * @return {number}
     */
    getBunnies() {
      return bunnies;
    }

  });
})();
