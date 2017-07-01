/**
 * Woodcutter unit.
 */
class WoodcutterUnit extends WorkUnit {

  constructor() {
    super({});
    this.id          = 'woodcutter';
    this.singular    = 'woodcutter';
    this.plural      = 'woodcutters';
    this.source = 'unemployed';
    this.efficiency  =  0.5;
    this.effectText  = 'Automatically cut wood';
    this.prereqs     = {basiccarpentry: true};
  }

  /**
   * Do woodcutter work each tick.
   */
  doWork() {
    //Woodcutters cut wood //Woodcutters cut wood
    civData.wood.net = civData.woodcutter.owned * (civData.woodcutter.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.wood);
    civData.wood.owned += civData.wood.net;
    if (civData.harvesting.owned && civData.woodcutter.owned > 0){ //and sometimes get herbs
      var herbsChance = civData.wood.specialChance * (civData.wood.increment + ((civData.gardening.owned) * civData.woodcutter.owned / 5.0)) * getWonderBonus(civData.herbs);
      var herbsEarned = rndRound(herbsChance);
      civData.herbs.net += herbsEarned;
      civData.herbs.owned += herbsEarned;
    }
  }
}
