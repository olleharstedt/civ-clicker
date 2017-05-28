/* @flow */
'use strict';

/**
 * Plugin for workers ticking.
 * @prop object tickSub
 */
CivClicker.plugins.Workers = (function() {

  function doWoodcutters() {
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
        clearSpecialResourceNets();

        // Production workers do their thing.
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
