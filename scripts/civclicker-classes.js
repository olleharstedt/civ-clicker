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

function Unit(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Unit)) { return new Unit(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: singular, plural, subType, prereqs, require, effectText, alignment,
	// source, efficiency_base, efficiency, onWin, lootFatigue, killFatigue, killExhaustion, species
	// place, ill
	return this;
}
// Common Properties: type="unit"
Unit.prototype = new CivObj({
	constructor: Unit,
	type: 			"unit",
	salable: 		true,
	get customQtyId() { 
		return this.place + "CustomQty"; 
	},
	set customQtyId(value) { 
		return this.customQtyId; 
	}, // Only here for JSLint.
	alignment: 		"player", // Also: "enemy"
	species: 		"human", // Also:  "animal", "mechanical", "undead"
	place: 			"home", // Also:  "party"
	combatType: 	"",  // Default noncombatant.  Also "infantry","cavalry","animal"
	onWin: function() { return; }, // Do nothing.
	get vulnerable() { 
		return ((this.place == "home")&&(this.alignment=="player")&&(this.subType=="normal")); 
	},
	set vulnerable(value) { 
		return this.vulnerable; 
	}, // Only here for JSLint.
	get isPopulation () {
		if (this.alignment != "player") { 
			return false; 
		} else if (this.subType == "special" || this.species == "mechanical") { 
			return false;
		} else {
			//return (this.place == "home")
			return true;
		}
	},
	set isPopulation (v) {
		return this.isPopulation;
	},
	init: function(fullInit) { 
		CivObj.prototype.init.call(this,fullInit);
		// Right now, only vulnerable human units can get sick.
		if (this.vulnerable && (this.species=="human")) {
			this.illObj = { owned: 0 };
		} 
		return true; 
	},
	//xxx Right now, ill numbers are being stored as a separate structure inside curCiv.
	// It would probably be better to make it an actual 'ill' property of the Unit.
	// That will require migration code.
	get illObj() { 
		return curCiv[this.id+"Ill"]; 
	},
	set illObj(value) { 
		curCiv[this.id+"Ill"] = value; 
	}, 
	get ill() { 
		return isValid(this.illObj) ? this.illObj.owned : undefined; 
	},
	set ill(value) { 
		if (isValid(this.illObj)) { this.illObj.owned = value; } 
	},
	get partyObj() { 
		return civData[this.id+"Party"]; 
	},
	set partyObj(value) { 
		return this.partyObj; 
	}, // Only here for JSLint.
	get party() { 
		return isValid(this.partyObj) ? this.partyObj.owned : undefined; 
	},
	set party(value) { 
		if (isValid(this.partyObj)) { 
			this.partyObj.owned = value; 
		} 
	},
	// Is this unit just some other sort of unit in a different place (but in the same limit pool)?
	isDest: function() { 
		return (this.source !== undefined) && (civData[this.source].partyObj === this); 
	},
	get limit() { 
		return (this.isDest()) ? civData[this.source].limit 
											 : Object.getOwnPropertyDescriptor(CivObj.prototype,"limit").get.call(this); 
	},
	set limit(value) { 
		return this.limit; 
	}, // Only here for JSLint.

	// The total quantity of this unit, regardless of status or place.
	get total() { 
		return (this.isDest()) ? civData[this.source].total : (this.owned + (this.ill||0) + (this.party||0)); 
	},
	set total(value) { 
		return this.total; 
	} // Only here for JSLint.
},true);

function Achievement(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Achievement)) { 
		// Prevent accidental namespace pollution
		return new Achievement(props); 
	} 
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: test
	return this;
}
// Common Properties: type="achievement"
Achievement.prototype = new CivObj({
	constructor: Achievement,
	type: "achievement",
	initOwned: false,
	prestige : true, // Achievements are not lost on reset.
	vulnerable : false,
	get limit() { 		return 1; }, // Can't re-buy these.
	set limit(value) { 	return this.limit; } // Only here for JSLint.
},true);
