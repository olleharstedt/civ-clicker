class Unit extends CivObj { // props is an object containing the desired properties.
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
    this.canEquip    = [];        // List of tools this unit can equip.
    this.equipment   = {};        // Key-value store of equipment for this unit type.

    CivObj.call(this,props);
    copyProps(this,props,null,true);
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
}
