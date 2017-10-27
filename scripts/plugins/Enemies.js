/* @flow */
'use strict';

/**
 * Deals with enemies.
 */
CivClicker.plugins.Enemies = (() => {
  return new (class EnemiesPlugin {

    /**
     *
     */
    constructor() {
      this.isNight = false; // start at day
      this.hearthsOwned = curCiv.hearths.owned;
    }

    /**
     * Tick.
     */
    tick() {
      /*
      / Get chance for wolves to attack
      */
    }

    /**
     * Init plugin.
     */
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.tick();
      });
      
      // Listen to the DayNight plugin.
      this.daySub = CivClicker.Events.subscribe('daynight.day.begin', () => {
        this.isNight = false;
      });
      this.nightSub = CivClicker.Events.subscribe('daynight.night.begin', () => {
        this.isNight = true;
      });
      
      // Update number of hearths on successful and finished purchase.
      this.buySuccessSub = CivClicker.Events.subscribe('global.doPurchase.success', () => {
        this.hearthsOwned = curCiv.hearths.owned;
      });
      this.buyFinishedSub = CivClicker.Events.subscribe('global.doPurchase.finished', () => {
        this.hearthsOwned = curCiv.hearths.owned;
      });
    }

  });
})();
