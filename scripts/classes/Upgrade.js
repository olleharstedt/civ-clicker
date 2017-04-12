function Upgrade(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Upgrade)) { return new Upgrade(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: subType, efficiency, extraText, onGain
	if (this.subType == "prayer") { this.initOwned = undefined; } // Prayers don't get initial values.
	if (this.subType == "pantheon") { this.prestige = true; } // Pantheon upgrades are not lost on reset.
	return this;
}

/** Common Properties: type="upgrade"
 * @property {boolean} useProgressBar If true, will display progress during building
 * @property {number} progressTimeLeft Milliseconds of left building time. 0 means not building.
 */
Upgrade.prototype = new CivObj({
	constructor: Upgrade,
	type: "upgrade",
	initOwned: false,
	vulnerable: false,
	get limit() { return 1; }, // Can't re-buy these.
	set limit(value) { return this.limit; }, // Only here for JSLint.
  useProgressBar: true,
  progressTimeLeft: 0,

  /**
   * Get the td cell where progress bar will be put.
   * @return {object}
   */
  getProgressBarCell: function(id) {
    return $('#' + id + 'Row td:first-child');
  }

},true);

