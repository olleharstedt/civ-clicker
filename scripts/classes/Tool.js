/**
 * Tool class
 * @constructor
 * @param {object} props - Properties
 */
function Tool(props)
{
  // Prevent accidental namespace pollution
  if (!(this instanceof Tool)) {
    return new Tool(props);
  }
  CivObj.call(this, props);
  copyProps(this, props, null, true);
  return this;
}

/**
 * @property {string} name     - Like 'axe' etc.
 * @property {string} material - TODO
 * @property {string} icon     - Name of icon pic.
 * @property {object} require  - Cost to build the tool.
 */
Tool.prototype = new CivObj({
  constructor:    Tool,
  type:           'tool',
  material:        '',
  icon:           'missingicon.png',
  require:        {},
  useProgressBar: true,

  reset() {
    this.owned = 0;
  },

  /**
   * @return {number}
   */
  calculateProgressTime(amount) {
    let time = 0;
    for (let material in this.require) {
      switch (material) {
        case 'stone':
          // One second per stone used.
          time += this.require[material] * amount * 1000;
          break;
      }
    }
    return time;
  },

  /**
   * @return {Element}
   */
  getProgressBarCell() {
    const selector = '#toolsTable .tool-row-' + this.name + ' .button-td';
    const cells = $(selector);
    return cells[0];
  },

  /**
   * @return {number}
   */
  getTotalEquipped() {
    let amount = 0;
    unitData.forEach((unit) => {
      amount += unit.getEquipmentAmount(this);
    });
    return amount;
  },

  /**
   * Return number of available tools (not equipped).
   * @return {number}
   */
  getAvailableTools() {
    return this.owned - this.getTotalEquipped();
  },

  /**
   * Total amount of unequipped tools available.
   * @return {number}
   */
  totalUnequipped() {
  }

}, true);
