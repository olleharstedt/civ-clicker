/**
 * Farmer unit.
 */
class FarmerUnit extends WorkUnit {
  get efficiency() { 
    return this.efficiency_base + (0.1 * (
      + civData.domestication.owned + civData.ploughshares.owned + civData.irrigation.owned 
      + civData.croprotation.owned + civData.selectivebreeding.owned + civData.fertilisers.owned 
      + civData.blessing.owned)); 
  }
  set efficiency(value) { this.efficiency_base = value; }
  doWork() {
    const specialChance = civData.food.specialChance + (0.1 * civData.flensing.owned);
    let millMod = 1;
    if (population.current > 0) { 
      millMod = population.living / population.current; 
    }
    civData.food.net += (
      civData.farmer.owned 
      * (1 + (civData.farmer.efficiency * curCiv.morale.efficiency)) 
      * ((civData.pestControl.timer > 0) ? 1.01 : 1) 
      * getWonderBonus(civData.food) 
      * (1 + civData.walk.rate/120) 
      * (1 + civData.mill.owned * millMod / 200) //Farmers farm food
    );
    civData.food.net -= population.living; //The living population eats food.
    civData.food.owned += civData.food.net;
    if (civData.skinning.owned && civData.farmer.owned > 0){ //and sometimes get skins
      const skinsChance = specialChance * (civData.food.increment + ((civData.butchering.owned) * civData.farmer.owned / 15.0)) * getWonderBonus(civData.skins);
      const skinsEarned = rndRound(skinsChance);
      civData.skins.net += skinsEarned;
      civData.skins.owned += skinsEarned;
    }
  }
}
