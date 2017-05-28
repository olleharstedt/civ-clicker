/* @flow */
'use strict';

/**
 * Plugin for workers ticking.
 * @prop object tickSub
 */
CivClicker.plugins.Workers = (function() {

  function doBlacksmiths() {
    var oreUsed = Math.min(civData.ore.owned, (civData.blacksmith.owned * civData.blacksmith.efficiency * curCiv.morale.efficiency));
    var metalEarned = oreUsed * getWonderBonus(civData.metal);
    civData.ore.net -= oreUsed;
    civData.ore.owned -= oreUsed;
    civData.metal.net += metalEarned;
    civData.metal.owned += metalEarned;
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
        doBlacksmiths();
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
