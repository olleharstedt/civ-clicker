/**
 * @constructor
 * @param {object} props Properties
 * @param {boolean} asProto
 * @todo Create a mechanism to automate the creation of a class hierarchy,
 *       specifying base class, shared props, instance props.
 */
function CivObj(props, asProto)
{
	if (!(this instanceof CivObj)) { return new CivObj(props); } // Prevent accidental namespace pollution
	//xxx Should these just be taken off the prototype's property names?
	var names = asProto ? null : [
		"id","name","subType","owned","prereqs","require","salable","vulnerable","effectText"
		,"prestige","initOwned","init","reset","limit","hasVariableCost"
	];
	Object.call(this,props);
	copyProps(this,props,names,true);
	return this;
}

/**
 * Common Properties: id, name, owned, prereqs, require, effectText,
 * @todo Add save/load methods.
 * @property {object} constructor     - ??
 * @property {string} subType         - ??
 * @property {object} prereqs         -
 * @property {object} require         - Price
 * @property {boolean} vulnerable     - If object can be destroyed?
 * @property {string} effectText      - ??
 * @property {boolean} prestige       - ??
 * @property {number} initOwned       - ??
 * @property {function} init          - ??
 * @property {boolean} useProgressBar - If true, progress bar will be shown at purchase
 * @property {function} calculateProgressTime
 */
CivObj.prototype = {
	constructor: CivObj,
	subType: "normal",
	get data() { return curCiv[this.id]; },
	set data(value) { curCiv[this.id] = value; },
	get owned() { return this.data.owned; },
	set owned(value) { this.data.owned = value; },
	prereqs: {},
	require: {}, // Default to free.  If this is undefined, makes the item unpurchaseable
	salable: false,
	vulnerable: true,
	effectText: "",
	prestige: false,
	initOwned: 0,  // Override this to undefined to inhibit initialization.  Also determines the type of the 'owned' property.
	init: function(fullInit) { 
		if (fullInit === undefined) { fullInit = true; }
		if (fullInit || !this.prestige)  { 
			this.data = {};
			if (this.initOwned !== undefined) { this.owned = this.initOwned; }
		} 
		return true; 
	},
	reset: function() { return this.init(false); }, // Default reset behavior is to re-init non-prestige items.
	get limit() { return (typeof this.initOwned == "number" ) ? Infinity // Default is no limit for numbers
					   : (typeof this.initOwned == "boolean") ? true : 0; }, // true (1) for booleans, 0 otherwise.
	set limit(value) { return this.limit; }, // Only here for JSLint.
	//xxx This is a hack; it assumes that any CivObj with a getter for its
	// 'require' has a variable cost.  Which is currently true, but might not
	// always be.
	hasVariableCost: function() { 
		var i;
		// If our requirements have a getter, assume variable.
		//xxx This won't work if it inherits a variable desc.
		var requireDesc = Object.getOwnPropertyDescriptor(this,"require");
		if (!requireDesc) { return false; } // Unpurchaseable
		if (requireDesc.get !== undefined) { return true; }
		// If our requirements contain a function, assume variable.
		for(i in this.require) { if (typeof this.require[i] == "function") { return true; } }
		return false;
	},

	// Return the name for the given quantity of this object.
	// Specific 'singular' and 'plural' used if present and appropriate,
	// otherwise returns 'name'.
	getQtyName: function(qty) { 
		if (qty === 1 && this.singular) { return this.singular; }
		if (typeof qty == "number" && this.plural) { return this.plural; }
		return this.name || this.singular || "(UNNAMED)";
	},
  useProgressBar: false,

  /**
   * Calculate the time it takes to build object.
   * @param {number} quantity - Number of buildings
   * @return {number}
   */
  calculateProgressTime: function(quantity) {

    if (!this.useProgressBar) {
      return 0;
    }

    if (this.require == {}) {
      return 0;
    }

    // Assume at least one living person.
    // But can't be 1, since log(1) = 0
    var livingPopulation =
      population.living > 1 ?  population.living : 1.1;

    var sum = 0;

    for (type in this.require) {
      var resource = civData[type];
      Logger.debug('resource', resource);
      var resourceAmount = this.require[type];
      Logger.debug('resourceAmount', resourceAmount);
      sum += resourceAmount * resource.progressFactor;
      Logger.debug('sum', sum);
    }

    sum = sum * quantity;

    // More population -> less building time
    sum = sum / livingPopulation;

    Logger.debug('sum', sum);

    sum = sum * 500;

    Logger.debug('sum', sum);
    
    return sum;
  }
};
