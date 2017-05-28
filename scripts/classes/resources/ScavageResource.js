/**
 * Scavage carcass for meat, bone and leather.
 */
class ScavageResource extends Resource {
  constructor() {
    super({});
    this.id              = 'scavage';
    this.name            = 'scavage';
    this.increment       =  1;
    this.subType         = 'basic';
    this.verb            = 'scavage';
    this.activity        = 'Scavaging';
    this.progressFactor  =  1;
    this.templateName    = '#scavage-resource-row-template';
    this.prereqs         = {
      handaxe: 1
    };
  }

  /**
   * Used when scavage is clicked/produced.
   */
  incrementResource() {
    civData.food.owned += civData.gather.increment;

    // Checks to see that resources are not exceeding their limits
    if (civData.food.owned > civData.food.limit) {
      civData.food.owned = civData.food.limit;
    }

    if (Math.random() > 0.9) {
      civData.skins.owned += 1;
      gameLog('Found skin while scavaging');
    } else if (Math.random() > 0.9) {
      civData.corpses.owned += 1;
      gameLog('Found bone (corpse) while scavaging');
    }

    updateResourceTotals();
  }
}
