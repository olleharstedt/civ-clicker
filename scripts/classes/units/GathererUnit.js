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
    this.canEquip        = [
      'handaxe'
    ]
  }

  get efficiency() { 
    return 1;
  }

  set efficiency(value) {
    this.efficiency_base = value;
  }

  doWork() {
    const inc = civData.gather.incrementResource(
      'gather',
      civData.gatherer.owned
    );
    civData.food.net += inc;
    //const inc = 2 * civData.gatherer.owned; 
    //civData.food.owned += inc;
  }

}
