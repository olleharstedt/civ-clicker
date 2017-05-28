/* @flow */
'use strict';

/**
 * Plugin for workers ticking.
 * @prop object tickSub
 */
CivClicker.plugins.Workers = new (class WorkersPlugin {
  init() {
    this.tickSub = CivClicker.Events.subscribe('global.tick', () => {

      // The "net" values for special resources are just running totals of the
      // adjustments made each tick; as such they need to be zero'd out at the
      // start of each new tick.
      clearSpecialResourceNets();

      // Production workers do their thing.
      unitData.forEach((unit) => {
        if (unit instanceof WorkUnit) {
          unit.doWork();
        }
      });
    });
  }

  unload() {
    if (this.tickSub) {
      this.tickSub.remove();
    }
  }
});
