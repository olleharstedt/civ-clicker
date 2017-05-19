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
 * @property {string} templateName   - Name of template that Mustache.js will use to render resource row.
 */
Resource.prototype = new CivObj({
  constructor: Resource,
  type: 'resource',
  increment: 0,
  specialChance: 0,
  specialMaterial: '',
  activity: 'gathering', //I18N
  progressFactor: 1,
  templateName: '#resource-row-template',
  prereqs: {},

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
      $(this.templateName).html(),
      {
        objId: objId,
        objName: objName.charAt(0).toUpperCase() + objName.slice(1),
        verb: this.verb.charAt(0).toUpperCase() + this.verb.slice(1),
        available: this.meetsPrereqs(),
        notAvailableTooltip: this.notAvailableTooltip
      }
    );
    return s;
  },

  /**
   * @return {boolean}
   */
  meetsPrereqs() {
    const prereqObj = this.prereqs;

    if (prereqObj instanceof Requirement) {
      return prereqObj.isFulfilled();
    }

    for(let i in prereqObj) {
      // HACK:  Ugly special checks for non-upgrade pre-reqs.
      // This should be simplified/eliminated once the resource
      // system is unified.
      if (i === 'deity') { // Deity
        if (getCurDeityDomain() != prereqObj[i]) { return false; }
      } else if (i === 'wonderStage') { //xxx Hack to check if we're currently building a wonder.
        if (curCiv.curWonder.stage !== prereqObj[i]) { return false; }
      } else if (isValid(civData[i]) && isValid(civData[i].owned)) { // Resource/Building/Upgrade
        if (typeof prereqObj[i] == 'number' && civData[i].owned < prereqObj[i]) {
          return false;
        } else if (typeof prereqObj[i] == 'boolean' && civData[i].owned != prereqObj[i]) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * Update purchase row
   * @param {object} purchaseObj
   * @return
   */
  updateResourceRow() {
    const elem = ui.find('#' + this.id + 'Row');
    if (!elem) {
      // console.warn("Missing UI element for "+purchaseObj.id);
      // Not yet initialised?
      return;
    }

    // If the item's cost is variable, update its requirements.
    if (this.hasVariableCost()) {
      updateRequirements(this);
    }

    // Already having one reveals it as though we met the prereq.
    const havePrereqs = true; //(this.owned > 0) || meetsPrereqs(this.prereqs);

    // Special check: Hide one-shot upgrades after purchase; they're
    // redisplayed elsewhere.
    const hideBoughtUpgrade = ((this.type == 'upgrade') && (this.owned == this.limit) && !this.salable);

    const maxQty = canPurchase(this);
    const minQty = canPurchase(this, -Infinity);

    const buyElems = elem.querySelectorAll('[data-action="purchase"]');

    buyElems.forEach(function(elt) {
      var purchaseQty = dataset(elt, 'quantity');
      // Treat 'custom' or Infinity as +/-1.
      //xxx Should we treat 'custom' as its appropriate value instead?
      var absQty = Math.abs(purchaseQty);
      if ((absQty == 'custom') || (absQty == Infinity)) { 
        purchaseQty = Math.sign(purchaseQty); 
      }
      elt.disabled = ((purchaseQty > maxQty) || (purchaseQty < minQty));
    });

    // Reveal the row if  prereqs are met
    ui.show(elem, havePrereqs && !hideBoughtUpgrade);
  }
},true);
