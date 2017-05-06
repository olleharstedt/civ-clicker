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

  /**
   * This function is called every time a player clicks on a primary resource button
   * @param {string} objId
   */
  incrementResource: function(objId) {
    var purchaseObj = civData[objId];
    var numArmy = 0;

    if (!purchaseObj) {
      console.log('Unknown purchase: '+ objId);
      return;
    }

    unitData.forEach(function(elem) { 
      if ((elem.alignment == 'player') && (elem.species=='human')
          && (elem.combatType) && (elem.place == 'home')) { 
        numArmy += elem.owned; 
      } 
    }); // Nationalism adds military units.

    purchaseObj.owned += purchaseObj.increment 
    + (purchaseObj.increment * 9 * (civData.civilservice.owned)) 
    + (purchaseObj.increment * 40 * (civData.feudalism.owned)) 
    + ((civData.serfs.owned) * Math.floor(Math.log(civData.unemployed.owned * 10 + 1))) 
    + ((civData.nationalism.owned) * Math.floor(Math.log(numArmy * 10 + 1)));

    //Handles random collection of special resources.
    var specialChance = purchaseObj.specialChance;
    if (specialChance && purchaseObj.specialMaterial && civData[purchaseObj.specialMaterial]) {
      if ((purchaseObj === civData.food) && (civData.flensing.owned))    { specialChance += 0.1; }
      if ((purchaseObj === civData.stone) && (civData.macerating.owned)) { specialChance += 0.1; }
      if (Math.random() < specialChance) {
        var specialMaterial = civData[purchaseObj.specialMaterial];
        var specialQty =  purchaseObj.increment * (1 + (9 * (civData.guilds.owned)));
        specialMaterial.owned += specialQty;
        gameLog('Found ' + specialMaterial.getQtyName(specialQty) + ' while ' + purchaseObj.activity); // I18N
      }
    }
    //Checks to see that resources are not exceeding their limits
    if (purchaseObj.owned > purchaseObj.limit) {
      purchaseObj.owned = purchaseObj.limit;
    }

    ui.find('#clicks').innerHTML = prettify(Math.round(++curCiv.resourceClicks));
    updateResourceTotals(); //Update the page with totals
  },
  increment: 0,
  specialChance: 0,
  specialMaterial: '',
  activity: 'gathering', //I18N
  progressFactor: 1
},true);
