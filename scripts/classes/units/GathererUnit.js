/**
 * Gatherer unit.
 */
class GathererUnit extends WorkUnit {

  constructor() {
    super({});
    this.id              = 'gatherer';
    this.singular        = 'gatherer';
    this.plural          = 'gatherers';
    this.source          = 'unemployed';
    this.efficiency_base =  0.2;
    this.effectText      = 'Gather for food, wood and stone';
    this._canEquip        = [
      'handaxe'
    ];
  }

  get efficiency() { 
    return 1;
  }

  set efficiency(value) {
    this.efficiency_base = value;
  }

  doWork() {
    /*
    const inc = civData.gather.incrementResource(
      'gather',
      civData.gatherer.owned
    );
    civData.food.net += inc;
    */
    //const inc = 2 * civData.gatherer.owned; 
    //civData.food.owned += inc;

    const owned = civData.gatherer.owned;
    const foodChance = Math.pow(0.9, owned);
    if (Math.random() > foodChance) {
      const found = owned;
      const formatChance = Math.round(((1 - foodChance) * 100)) + '%';
      civData.food.owned += found;
      gameLog(`Found ${found} food while gathering (chance ${formatChance})`);
    }
  }

}
