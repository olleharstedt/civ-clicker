/**
 * Tanner unit.
 */
class TannerUnit extends WorkUnit {

  constructor() {
    super({});
    this.id = 'tanner';
    this.singular= 'tanner';
    this.plural= 'tanners';
    this.source= 'unemployed';
    this.efficiency=  0.5;
    this.effectText= 'Convert skins to leather';
    this.prereqs = {
      tannery: 1
    };
  }

  get limit() {
    return civData.tannery.owned;
  }

  set limit(value) {
    return this.limit;
  }

  /**
   * Do work each tick.
   */
  doWork() {
    const skinsUsed = Math.min(civData.skins.owned, (civData.tanner.owned * civData.tanner.efficiency * curCiv.morale.efficiency));
    const leatherEarned = skinsUsed * getWonderBonus(civData.leather);
    civData.skins.net -= skinsUsed;
    civData.skins.owned -= skinsUsed;
    civData.leather.net += leatherEarned;
    civData.leather.owned += leatherEarned;
  }
}
