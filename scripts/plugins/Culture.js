/* @flow */
'use strict';

/**
 * Player earns culture points by achieveming certain goals, like
 * population above 10 or 100, or owning 200 food, and so on.
 * @property {array} cultureConditions List of conditions that grants culture points.
 * @property {array} fulfilledConditions List of conditions that has been fulfilled/done.
 */
CivClicker.plugins.Culture = (function() {

  /**
   * Condition class for culture points.
   * Private class hidden in closure.
   * @property {string} name
   * @property {object|function} requires Either a boolean method to test, or an object that can be fed to meetsPrereqs().
   * @property {number} points
   * @property {boolean} isFulfilled
   */
  class CultureCondition {

    /**
     * @param {string} name
     * @param {number} points
     * @param {object|function} requires
     */
    constructor(name, points, requires) {
      this.name = name;
      this.requires = requires;
      this.points = points;
      this._isFulfilled = false;
    }

    /**
     * @return {boolean}
     */
    isFulfilled() {
      if (typeof this.requires == 'object') {
        return meetsPrereqs(this.requires);
      } else {
        return this.requires();
      }
    }

    /**
     * Run after isFulfilled returns true to apply
     * this condition and give culture points.
     */
    fulfill() {
      this._isFulfilled = true;
      civData.culture.owned += this.points;
      const msg = `You gain ${this.points} culture point by ${this.name}!`;
      gameLog(msg);
      if (Notification.permission == 'granted') {
        new Notification(
          'CivClicker',
          {body: msg}
        );
      } else {
        new PNotify({
          title: 'Culture point',
          text: msg,
          timer: 1,
          type: 'notice',
          icon: false,
          buttons: {
            closer: true,
            closer_hover: false,
            sticker: false
          }
        });
      }
    }
  }

  return new (class CulturePlugin {
    constructor() {
      // Subscription to event global.tick.
      this.tickSub = null;

      // True if data was loaded from save file.
      this._loaded = false;
    }

    /**
     * Init plugin.
     */
    init() {
      // Only setup data if data was not loaded from save file.
      // TODO: Change flow?
      if (!this._loaded) {
        this.setupConditions();
      }
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
        this.checkCultureConditions();
      });
    }

    /**
     * Setup available conditions.
     */
    setupConditions() {
      this.cultureConditions = [
        new CultureCondition(
          '10 population',
          1,
          () => {
            return population.living > 9;
          }
        )
      ];
      this.fulfilledConditions = [];
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
     * Save what conditions we've already fulfilled.
     */
    save() {
      return {
        cultureConditions: this.cultureConditions,
        fulfilledConditions: this.fulfilledConditions
      };
    }

    /**
     * Load what conditions we've fulfilled.
     */
    load(data) {
      this.cultureConditions = data.cultureConditions;
      this.fulfilledConditions = data.fulfilledConditions;
      this._loaded = true;
    }

    /**
     * Called when game is reset by user.
     * Needed to make save/load work properly.
     */
    reset() {
      this._loaded = false;
      this.setupConditions();
    }

    /**
     * Loop through culture conditions and grant
     * culture point if fulfilled.
     */
    checkCultureConditions() {
      /** @type {number[]} */
      let remove = [];

      if (this.cultureConditions === undefined) {
        alert('Internal error: Found no culture conditions. Resetting game.');
        resetCivClicker();
        return;
      }

      // Check all remaining conditions.
      this.cultureConditions.forEach((condition, pos) => {
        if (condition.isFulfilled()) {
          condition.fulfill();
          // Remember position so we can move this condition to
          // the other array.
          remove.push(pos);
        }
      });

      // Move all fulfilled conditions to fulfilled array.
      remove.forEach((pos) => {
        let removed = this.cultureConditions.splice(pos, 1);
        this.fulfilledConditions.push(removed);
      });
    }
  });

})();
