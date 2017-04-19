function Upgrade(props) // props is an object containing the desired properties.
{
  if (!(this instanceof Upgrade)) {
    // Prevent accidental namespace pollution
    return new Upgrade(props);
  }
  CivObj.call(this,props);
  copyProps(this,props,null,true);
  // Occasional Properties: subType, efficiency, extraText, onGain
  if (this.subType == 'prayer') {
    // Prayers don't get initial values.
    this.initOwned = undefined;
  }
  if (this.subType == 'pantheon') {
    // Pantheon upgrades are not lost on reset.
    this.prestige = true;
  }
  return this;
}

/** Common Properties: type="upgrade"
 * @property {string} type Civ global type string. Always 'upgrade'.
 * @property {string} subType Which subtype of upgrade.
 * @property {boolean} useProgressBar If true, will display progress during building
 * @property {number} progressTimeLeft Milliseconds of left building time. 0 means not building.
 */
Upgrade.prototype = new CivObj({
  constructor: Upgrade,
  type: 'upgrade',
  initOwned: false,
  vulnerable: false,
  get limit() { return 1; }, // Can't re-buy these.
  set limit(value) { return this.limit; }, // Only here for JSLint.
  useProgressBar: true,
  progressTimeLeft: 0,

  /**
   * Get the td cell where progress bar will be put.
   * Upgrades can be both in upgrade tab and deity tab
   * or trade tab.
   * @return {object} The HTML jQuery object.
   */
  getProgressBarCell: function(id) {
    var td = $('#' + id + 'Row td:first-child');
    if (td.length == 0) {
      var span = $('#' + id + 'Row > span');
      if (span.length > 1) {
        return span[0];
      } else {
        return span;
      }
    } else {
      return td;
    }
  }

},true);

