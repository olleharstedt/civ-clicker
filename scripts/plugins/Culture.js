/* @flow */
'use strict';

/**
 * Player earns culture points by achieveming certain goals, like
 * population above 10 or 100, or owning 200 food, and so on.
 * @property {array} cultureConditions List of conditions that grants culture points.
 * @property {array} fulfilledConditions List of conditions that has been fulfilled/done.
 */
CivClicker.plugins.Culture = new (class CulturePlugin {
  constructor() {
    this.tickSub = null;
    this.cultureConditions = [
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
  }

});

/**
 * Condition class.
 */
class CultureCondition {

  /**
   * @param {string} name
   * @param {object} requires
   * @param {number} points
   */
  constructor(name, requires, points) {
    this.name = name;
    this.requires = requires;
    this.points = points;
    this.isFulfilled = false;
  }

  isFulfilled() {
    return meetsPrereqs(this.requires);
  }

  fulfill() {
    this.isFulfilled = true;
    civData.culture.owned += this.points;
    gameLog(`You gain ${this.points} culture point by ${this.name}!`);
  }
}
