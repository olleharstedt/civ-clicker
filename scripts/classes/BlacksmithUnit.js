/**
 * Blacksmith unit.
 */
class BlacksmithUnit extends WorkUnit {

  constructor() {
    super({});
    this.id= 'blacksmith';
    this.singular= 'blacksmith';
    this.plural= 'blacksmiths';
    this.source= 'unemployed';
    this.efficiency=  0.5;
    this.effectText= 'Convert ore to metal';

    this.prereqs = {
      smithy: 1
    };
  }

  get limit() {
    return civData.smithy.owned;
  }

  set limit(value) {
    return this.limit;
  }

  /**
   * Do work each tick.
   */
  doWork() {
    const oreUsed = Math.min(civData.ore.owned, (civData.blacksmith.owned * civData.blacksmith.efficiency * curCiv.morale.efficiency));
    const metalEarned = oreUsed * getWonderBonus(civData.metal);
    civData.ore.net -= oreUsed;
    civData.ore.owned -= oreUsed;
    civData.metal.net += metalEarned;
    civData.metal.owned += metalEarned;
  }
}
