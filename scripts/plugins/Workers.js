/* @flow */
'use strict';

/**
 * Plugin for workers ticking.
 * @prop object tickSub
 */
CivClicker.plugins.Workers = (function() {

  function doFarmers() {
    var specialChance = civData.food.specialChance + (0.1 * civData.flensing.owned);
    var millMod = 1;
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
      var skinsChance = specialChance * (civData.food.increment + ((civData.butchering.owned) * civData.farmer.owned / 15.0)) * getWonderBonus(civData.skins);
      var skinsEarned = rndRound(skinsChance);
      civData.skins.net += skinsEarned;
      civData.skins.owned += skinsEarned;
    }
  }
  function doWoodcutters() {
    civData.wood.net = civData.woodcutter.owned * (civData.woodcutter.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.wood); //Woodcutters cut wood
    civData.wood.owned += civData.wood.net;
    if (civData.harvesting.owned && civData.woodcutter.owned > 0){ //and sometimes get herbs
      var herbsChance = civData.wood.specialChance * (civData.wood.increment + ((civData.gardening.owned) * civData.woodcutter.owned / 5.0)) * getWonderBonus(civData.herbs);
      var herbsEarned = rndRound(herbsChance);
      civData.herbs.net += herbsEarned;
      civData.herbs.owned += herbsEarned;
    }
  }

  function doMiners() {
    var specialChance = civData.stone.specialChance + (civData.macerating.owned ? 0.1 : 0);
    civData.stone.net = civData.miner.owned * (civData.miner.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.stone); //Miners mine stone
    civData.stone.owned += civData.stone.net;
    if (civData.prospecting.owned && civData.miner.owned > 0){ //and sometimes get ore
      var oreChance = specialChance * (civData.stone.increment + ((civData.extraction.owned) * civData.miner.owned / 5.0)) * getWonderBonus(civData.ore);
      var oreEarned = rndRound(oreChance);
      civData.ore.net += oreEarned;
      civData.ore.owned += oreEarned;
    }
  }

  function doBlacksmiths() {
    var oreUsed = Math.min(civData.ore.owned, (civData.blacksmith.owned * civData.blacksmith.efficiency * curCiv.morale.efficiency));
    var metalEarned = oreUsed * getWonderBonus(civData.metal);
    civData.ore.net -= oreUsed;
    civData.ore.owned -= oreUsed;
    civData.metal.net += metalEarned;
    civData.metal.owned += metalEarned;
  }

  function doTanners() {
    var skinsUsed = Math.min(civData.skins.owned, (civData.tanner.owned * civData.tanner.efficiency * curCiv.morale.efficiency));
    var leatherEarned = skinsUsed * getWonderBonus(civData.leather);
    civData.skins.net -= skinsUsed;
    civData.skins.owned -= skinsUsed;
    civData.leather.net += leatherEarned;
    civData.leather.owned += leatherEarned;
  }

  function doClerics() {
    var pietyEarned = (
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

  // Return an instance of the actual plugin.
  return new (class WorkersPlugin {
    init() {
      this.tickSub = CivClicker.Events.subscribe('global.tick', () => {
	
        // The "net" values for special resources are just running totals of the
        // adjustments made each tick; as such they need to be zero'd out at the
        // start of each new tick.
        // NB: Does not work when doFarmers etc moved to Workers plugin.
        clearSpecialResourceNets();

        // Production workers do their thing.
        doFarmers();
        doWoodcutters();
        doMiners();
        doBlacksmiths();
        doTanners();
        doClerics();

        unitData.forEach((unit) => {
          if (unit instanceof WorkUnit) {
            unit.doWork();
          }
        });
      });
    }

    unload() {
      if (this.tickSub) {
        this.tickSub.remove();
      }
    }
  });
})();
