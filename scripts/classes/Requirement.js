'use strict';

/**
 * Class to define requirements.
 * Base class.
 * @prop {array} or
 * @prop {array} and
 */
class Requirement {

  /**
   * @param {string} name
   * @param {number} amount
   */
  constructor(name, amount) {
    this.type = 'requirement';
    this.name = name;
    this.amount = amount;
  }

  /**
   * Returns true if this requirement is fulfilled.
   * @return {boolean}
   */
  isFulfilled() {
    return civData[this.name] && civData[this.name].owned >= this.amount;
  }
}

/**
 * Requirement that never is true.
 */
class NeverRequirement extends Requirement {
  isFulfilled() {
    return false;
  }
}

/**
 * Requirement chain for OR.
 * @prop {array} or - Array of requirements.
 */
class OrRequirement extends Requirement {
  constructor() {
    super(null, null);
    this.or = [];
  }

  /**
   * @return {boolean}
   */
  isFulfilled() {
    let orIsTrue = false;
    this.or.forEach((req) => {
      if (req.isFulfilled()) {
        orIsTrue = true;
      }
    });
    return orIsTrue;
  }

  add(req) {
    this.or.push(req);
  }
}

/**
 * Requirement chain for AND.
 * @prop {array} and - Array of requirements.
 */
class AndRequirement extends Requirement {
  constructor() {
    super();
    this.and = [];
  }

  /**
   * @return {boolean}
   */
  isFulfilled() {
    let andIsTrue = true;
    this.and.forEach((req) => {
      if (!req.isFulfilled()) {
        andIsTrue = false;
      }
    });
    return andIsTrue;
  }

  add(req) {
    this.or.push(req);
  }
}

/**
 * Tool requirement.
 */
class ToolRequirement extends Requirement {
  constructor(toolType, amount) {
    super();
    this.type = 'toolrequirement';
    this.toolType = toolType;
    this.amount = amount;
  }

  /**
   * @return {boolean}
   */
  isFulfilled() {
    return civData[this.toolType] && civData[this.toolType].owned >= this.amount;
  }
}

/**
 * Resource requirement.
 */
class ResourceRequirement extends Requirement {
  constructor(resourceType, amount) {
    super();
    this.type = 'resourcerequirement';
    this.resourceType = resourceType;
    this.amount = amount;
  }

  /**
   * @return {boolean}
   */
  isFulfilled() {
    return civData[this.resourceType] && civData[this.resourceType].owned >= this.amount;
  }
}
