/**
 * Cleric unit.
 */
class ClericUnit extends WorkUnit {

  constructor() {
    super({});
    this.id         = 'cleric';
    this.singular   = 'cleric';
    this.plural     = 'clerics';
    this.source     = 'unemployed';
    this.efficiency =  0.05;
    this.prereqs    = {
      temple: 1
    };
    this.effectText = 'Generate piety, bury corpses';
  }

  /**
   * Do work each tick.
   */
  doWork() {
    const pietyEarned = (
      civData.cleric.owned 
      * (civData.cleric.efficiency + (civData.cleric.efficiency * (civData.writing.owned))) 
      * (1 + ((civData.secrets.owned) 
      * (1 - 100/(civData.graveyard.owned + 100)))) 
      * curCiv.morale.efficiency 
      * getWonderBonus(civData.piety)
    );
    civData.piety.net += pietyEarned;
    civData.piety.owned += pietyEarned;
  }

  /**
   * @return number
   */
  get limit() {
    return civData.temple.owned;
  }

  /**
   * @param number value
   */
  set limit(value) {
    return this.limit;
  }
}
