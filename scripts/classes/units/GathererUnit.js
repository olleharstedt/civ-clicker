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
    */
    //const inc = 2 * civData.gatherer.owned; 
    //civData.food.owned += inc;

    const owned = civData.gatherer.owned;

    // Gatherers can sustain them selves.
    civData.food.net += owned;

    const foodChance = Math.pow(0.95, owned);
    if (Math.random() > foodChance) {
      const handaxes = this.getEquipmentAmount(civData['handaxe']);
      const found = 1 + (0.2 * handaxes);
      const formatChance = Math.round(((1 - foodChance) * 100)) + '%';
      civData.food.owned += found;
      gameLog(`Found ${found} food while gathering (chance ${formatChance})`);
    }

    const stoneChance = Math.pow(0.99, owned);
    if (Math.random() > stoneChance) {
      civData.stone.owned += 1;
      const formatChance = Math.round(((1 - stoneChance) * 100)) + '%';
      gameLog(`Found stone while gathering (chance ${formatChance})`);
    }

    const woodChance = Math.pow(0.99, owned);
    if (Math.random() > woodChance) {
      civData.wood.owned += 1;
      const formatChance = Math.round(((1 - woodChance) * 100)) + '%';
      gameLog(`Found wood while gathering (chance ${formatChance})`);
    }
  }

}
