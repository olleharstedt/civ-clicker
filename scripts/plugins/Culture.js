/* @flow */
'use strict';

/**
 * Player earns culture points by achieveming certain goals, like
 * population above 10 or 100, or owning 200 food, and so on.
 */
CivClicker.plugins.Culture = new (class CulturePlugin {
  constructor() {
    this.tickSub = null;
    this.cultureConditions = [
    ];
  }

  /**
   * Init plugin.
   */
  init() {
    this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
      this.checkCultureConditions();
    });
  }

  /**
   * Unload plugin.
   */
  unload() {
    if (this.tickSub) {
      this.tickSub.remove();
    }
  }

  /**
   * Loop through culture conditions and grant
   * culture point if fulfilled.
   */
  checkCultureConditions() {
  }

});
