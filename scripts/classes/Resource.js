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
 * @property {number} increment      - How much to increment with each click.
 * @property {string} name           - Like 'food', 'stone', etc.
 * @property {number} progressFactor - With how much each resource element should be multiplied when calculating progress time
 */
Resource.prototype = new CivObj({
  constructor: Resource,
  type: 'resource',
  increment: 0,
  specialChance: 0,
  specialMaterial: '',
  activity: 'gathering', //I18N
  progressFactor: 1,

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
  updateTotals() {
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
  incrementResource(objId) {
    let purchaseObj = civData[objId];
    let numArmy = 0;

    if (!purchaseObj) {
      console.log('Unknown purchase: ' + objId);
      return;
    }

    // Nationalism adds military units.
    unitData.forEach(function(elem) { 
      if (elem.alignment == 'player'
          && elem.species == 'human'
          && elem.combatType
          && elem.place == 'home') { 
        numArmy += elem.owned; 
      } 
    });

    purchaseObj.owned += purchaseObj.increment 
    + (purchaseObj.increment * 9 * (civData.civilservice.owned)) 
    + (purchaseObj.increment * 40 * (civData.feudalism.owned)) 
    + ((civData.serfs.owned) * Math.floor(Math.log(civData.unemployed.owned * 10 + 1))) 
    + ((civData.nationalism.owned) * Math.floor(Math.log(numArmy * 10 + 1)));

    //Handles random collection of special resources.
    let specialChance = purchaseObj.specialChance;
    if (specialChance && purchaseObj.specialMaterial && civData[purchaseObj.specialMaterial]) {
      if ((purchaseObj === civData.food) && (civData.flensing.owned))    { specialChance += 0.1; }
      if ((purchaseObj === civData.stone) && (civData.macerating.owned)) { specialChance += 0.1; }
      if (Math.random() < specialChance) {
        let specialMaterial = civData[purchaseObj.specialMaterial];
        let specialQty =  purchaseObj.increment * (1 + (9 * (civData.guilds.owned)));
        specialMaterial.owned += specialQty;
        gameLog('Found ' + specialMaterial.getQtyName(specialQty) + ' while ' + purchaseObj.activity); // I18N
      }
    }

    //Checks to see that resources are not exceeding their limits
    if (purchaseObj.owned > purchaseObj.limit) {
      purchaseObj.owned = purchaseObj.limit;
    }

    //Update the page with totals
    updateResourceTotals();
  },

  /**
   * Render the HTML row for this resource in the
   * primary resource table.
   * @return {string} html
   */
  getResourceRowText() {
    const objId = this.id;
    const objName = this.getQtyName(0);
    const s = Mustache.to_html(
      $('#resource-row-template').html(),
      {
        objId: objId,
        objName: objName.charAt(0).toUpperCase() + objName.slice(1),
        verb: this.verb.charAt(0).toUpperCase() + this.verb.slice(1)
      }
    );
    return s;
  }
},true);
