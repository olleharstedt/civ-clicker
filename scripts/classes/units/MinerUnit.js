/**
 * Miner unit.
 */
class MinerUnit extends WorkUnit {

  constructor() {
    super({});
    this.id         = 'miner';
    this.singular   = 'miner';
    this.plural     = 'miners';
    this.source     = 'unemployed';
    this.efficiency =  0.2;
    this.effectText = 'Automatically mine stone';
    this.prereqs    = {mining: true};
  }

  /**
   * Do work each tick.
   */
  doWork() {
    const specialChance = civData.stone.specialChance + (civData.macerating.owned ? 0.1 : 0);
    const toAdd = civData.miner.owned * (civData.miner.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.stone); //Miners mine stone
    civData.stone.net += toAdd;
    civData.stone.owned += toAdd;
    if (civData.prospecting.owned && civData.miner.owned > 0){ //and sometimes get ore
      const oreChance = specialChance * (civData.stone.increment + ((civData.extraction.owned) * civData.miner.owned / 5.0)) * getWonderBonus(civData.ore);
      const oreEarned = rndRound(oreChance);
      civData.ore.net += oreEarned;
      civData.ore.owned += oreEarned;
    }
  }
}
