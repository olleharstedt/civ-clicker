/**
 * Resource class
 * @constructor
 * @param {object} props - Properties
 */
function Resource(props)
{
  // Prevent accidental namespace pollution
  if (!(this instanceof Resource)) {
    return new Resource(props);
  }
  CivObj.call(this,props);
  copyProps(this,props,null,true);
  // Occasional Properties: increment, specialChance, net
  return this;
}

/**
 * @property {string} name           - Like 'food', 'stone', etc.
 * @property {number} progressFactor - With how much each resource element should be multiplied when calculating progress time
 */
Resource.prototype = new CivObj({
  constructor: Resource,
  type: 'resource',
  /**
   * 'net' accessor always exists, even if the underlying value is undefined for most resources.
   * @return {number}
   */
  get net() { 
    if (typeof this.data.net !== 'number') {
      console.warn('.net not a number');
      this.data.net = 0;
    }
    return this.data.net; 
  },
  
  /**
   * @todo Not used?
   */
  set net(value) {
    this.data.net = value;
  },

  /**
   * Update limit.
   * Factored out from updateResourceTotals.
   */
  updateTotals: function() {
    if (civData[this.name]) {
      const limit = civData[this.name].limit;
      $('#max' + this.name).html(prettify(limit));
    } else {
      // Internal error.
    }
  },
  increment: 0,
  specialChance: 0,
  specialMaterial: '',
  activity: 'gathering', //I18N
  progressFactor: 1
},true);
