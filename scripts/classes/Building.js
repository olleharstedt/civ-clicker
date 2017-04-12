/**
 * @constructor
 * @param {object} props - Properties
 */
function Building(props)
{
	if (!(this instanceof Building)) { return new Building(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: subType, efficiency, devotion
	// plural should get moved during I18N.
	return this;
}

/**
 * Common Properties: type="building",customQtyId
 * @property {string} type      Always "building"
 * @property {string} alignment Always "player"
 * @property {string} place     Always "home"
 * @property {function} vulnerable Returns boolean if this building can be sacked
 * @property {customQtyId} string "buildingCustomQty" ?
 * @property {boolean} useProgressBar If true, will display progress during building
 * @property {number} progressTimeLeft Milliseconds of left building time. 0 means not building.
 */
Building.prototype = new CivObj({
	constructor: Building,
	type: "building",
	alignment:"player",
	place: "home",
	get vulnerable() { return this.subType != "altar"; }, // Altars can't be sacked.
	set vulnerable(value) { return this.vulnerable; }, // Only here for JSLint.
	customQtyId: "buildingCustomQty",
  useProgressBar: true,
  progressTimeLeft: 0,

  /**
   * Get the td cell where progress bar will be put.
   * @return {object}
   */
  getProgressBarCell: function(id) {
    return $('#' + id + 'Row .number');
  },

},true);

