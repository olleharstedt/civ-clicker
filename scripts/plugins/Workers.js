/* @flow */
'use strict';

/**
 * Plugin for workers ticking.
 * @prop object tickSub
 */
CivClicker.plugins.Workers = new (class WorkersPlugin {
  init() {
    this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
      // Production workers do their thing.
      doFarmers();
      doWoodcutters();
      doMiners();
      doBlacksmiths();
      doTanners();
      doClerics();
    });
  }

  unload() {
    if (this.tickSub) {
      this.tickSub.remove();
    }
  }
});
