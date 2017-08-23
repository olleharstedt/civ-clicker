class Unit extends CivObj {
 
  /**
   * @param object props The desired properties.
   */
  constructor(props) {
    super(props);
    //if (!(this instanceof Unit)) { return new Unit(props); } // Prevent accidental namespace pollution
    // Occasional Properties: singular, plural, subType, prereqs, require, effectText, alignment,
    // source, efficiency_base, efficiency, onWin, lootFatigue, killFatigue, killExhaustion, species
    // place, ill

    this.constructor = Unit;
    this.type        = 'unit';
    this.salable     = true;
    this.alignment   = 'player';  // Also: "enemy"
    this.species     = 'human';   // Also:  'animal', "mechanical", "undead"
    this.place       = 'home';    // Also:  'party'
    this.combatType  =	'';       // Default noncombatant.  Also "infantry","cavalry","animal"
    this._canEquip    = [];        // List of tools this unit can equip.
    this._equipment   = {};        // Key-value store of equipment for this unit type.

    CivObj.call(this,props);
    copyProps(this,props,null,true);
  }

  reset() {
    this._equipment = {};
    super.reset();
  }

  get customQtyId() {
    return this.place + 'CustomQty';
  }

  set customQtyId(value) {
    return this.customQtyId;
  }

  onWin() {
     // Do nothing.
    return;
  }

  get vulnerable() {
    return ((this.place == 'home')&&(this.alignment=='player')&&(this.subType=='normal'));
  }

  set vulnerable(value) {
    return this.vulnerable;
  }

  get isPopulation () {
    if (this.alignment != 'player') {
      return false;
    } else if (this.subType == 'special' || this.species == 'mechanical') {
      return false;
    } else {
      //return (this.place == "home")
      return true;
    }
  }

  set isPopulation (v) {
    return this.isPopulation;
  }

  init(fullInit) {
    CivObj.prototype.init.call(this,fullInit);
    // Right now, only vulnerable human units can get sick.
    if (this.vulnerable && (this.species=='human')) {
      this.illObj = { owned: 0 };
    }
    return true;
  }

  //xxx Right now, ill numbers are being stored as a separate structure inside curCiv.
  // It would probably be better to make it an actual 'ill' property of the Unit.
  // That will require migration code.
  get illObj() {
    return curCiv[this.id+'Ill'];
  }

  set illObj(value) {
    curCiv[this.id+'Ill'] = value;
  }

  get ill() {
    return isValid(this.illObj) ? this.illObj.owned : undefined;
  }

  set ill(value) {
    if (isValid(this.illObj)) { this.illObj.owned = value; }
  }

  get partyObj() {
    return civData[this.id+'Party'];
  }

  set partyObj(value) {
    return this.partyObj;
  }

  get party() {
    return isValid(this.partyObj) ? this.partyObj.owned : undefined;
  }

  set party(value) {
    if (isValid(this.partyObj)) {
      this.partyObj.owned = value;
    }
  }

  // Is this unit just some other sort of unit in a different place (but in the same limit pool)?
  isDest() {
    return (this.source !== undefined) && (civData[this.source].partyObj === this);
  }

  get limit() {
    return (this.isDest()) ? civData[this.source].limit
      : Object.getOwnPropertyDescriptor(CivObj.prototype,'limit').get.call(this);
  }

  set limit(value) {
    return this.limit;
  }

  // The total quantity of this unit, regardless of status or place.
  get total() {
    return (this.isDest()) ? civData[this.source].total : (this.owned + (this.ill||0) + (this.party||0));
  }

  set total(value) {
    return this.total;
  }

  /**
   * Returns true if this unit can equip tool.
   * Assumes one tool per unit, so never two swords for one man.
   * @param {Tool|string} tool tool or tool name
   * @return bool
   */
  canEquip(tool) {
    if (typeof tool == 'string') {
      if (civData[tool] == null) {
        return false;
      } else {
        tool = civData[tool];
      }
    }
    return this._canEquip.indexOf(tool.id) !== -1;
  }

  /**
   * Returns number of eqippable spaces left.
   * If you have 10 gatheres, and equipped five of them
   * with handaxes, you have 5 equip spaces left for the
   * handaxe..
   * @param {Tool} tool
   * @return {number}
   */
  equipSpaceLeft(tool) {
    if (typeof tool !== 'object') {
      throw 'tool must be object';
    }

    if (this.canEquip(tool)) {
      const equippedAmount = this.getEquipmentAmount(tool);
      const unitsOwned = civData[this.id].owned;
      return unitsOwned - equippedAmount;
    } else {
      return 0;
    }
  }

  /**
   * Returns true if this unit can unequip tool.
   * @param Tool tool
   * @return bool
   */
  canUnequip(tool) {
    return this._equipment[tool.id] > 0;
  }

  /**
   * Equip this unit with tool.
   * @param {Tool} tool
   * @param {number} amount
   */
  equip(tool, amount) {
    if (amount == undefined) {
      amount = 1;
    }

    const spaceLeft = this.equipSpaceLeft(tool);
    let toTransfer = 1;
    if (spaceLeft >= amount) {
      toTransfer = amount;
    } else if (spaceLeft < amount) {
      toTransfer = spaceLeft;
    }

    const availableTools = tool.getAvailableTools();

    if (availableTools < toTransfer) {
      toTransfer = availableTools;
    }

    if (this.canEquip(tool) && spaceLeft > 0) {
      if (typeof this._equipment[tool.id] == 'number') {
        this._equipment[tool.id] += parseInt(toTransfer);
      } else {
        this._equipment[tool.id] = parseInt(toTransfer);
      }
    }
  }

  /**
   * Unequip tool from this unit.
   * @param {Tool} tool
   * @param {number} amount
   */
  unequip(tool, amount) {
    if (amount == undefined) {
      amount = 1;
    }

    const equipmentAmount = this.getEquipmentAmount(tool);
    let toTransfer = 1;

    if (equipmentAmount >= amount) {
      toTransfer = amount;
    } else if (equipmentAmount < amount) {
      toTransfer = equipmentAmount;
    }

    if (this.canUnequip(tool) && equipmentAmount > 0) {
      this._equipment[tool.id] -= parseInt(toTransfer);
    }
  }

  /**
   * Returns the amount that is equiped for this unit and tool.
   * @param {Tool} tool
   * @return {number}
   */
  getEquipmentAmount(tool) {
    if (typeof this._equipment[tool.id] == 'number') {
      return this._equipment[tool.id];
    } else {
      return 0;
    }
  }

  /**
   * Retrun object that can be saved in local storage.
   * @return {object}
   */
  save() {
    return {
      owned: this.owned,
      _canEquip: this._canEquip,
      _equipment: this._equipment
    };
  }

  /**
   * Load data into object upon load.
   * Data should come from save() method above.
   * @param {object} data
   */
  load(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }

}
