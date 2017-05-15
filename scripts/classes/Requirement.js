'use strict';

/**
 * Class to define requirements.
 * Base class.
 */
class Requirement {
  constructor() {
    this.type = 'requirement';
  }

  /**
   * Returns true if this requirement is fulfilled.
   * @return {boolean}
   */
  isFulfilled() {
    return true;
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
