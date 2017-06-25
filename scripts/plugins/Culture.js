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
      gameLog(`You gain ${this.points} culture point by ${this.name}!`);
    }
  }

  return new (class CulturePlugin {
    constructor() {
      this.tickSub = null;
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
      /** @type {number[]} */
      let remove = [];

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
