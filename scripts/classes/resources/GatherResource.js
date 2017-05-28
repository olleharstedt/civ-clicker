class GatherResource extends Resource {
  constructor() {
    super({});
    this.id              = 'gather';
    this.name            = 'gather';
    this.increment       =  1;
    this.specialChance   =  0.1;
    this.subType         = 'basic';
    this.specialMaterial = 'stone';
    this.verb            = 'gather';
    this.activity        = 'gathering';
    this.progressFactor  =  1;
    this.templateName    = '#gather-resource-row-template';
  }

  get limit() {
    // Same as food.
    const barnBonus = ((civData.granaries.owned ? 2 : 1) * 200);
    return 200 + (civData.barn.owned * barnBonus); 
  }

  /**
   * Gathering increases food. There's no 'gather' resource.
   * @return
   */
  incrementResource() {
    civData.food.owned += civData.gather.increment;

    // Checks to see that resources are not exceeding their limits
    if (civData.food.owned > civData.food.limit) {
      civData.food.owned = civData.food.limit;
    }

    if (Math.random() > 0.9) {
      civData.wood.owned += 1;
      gameLog('Found wood while gathering');
    } else if (Math.random() > 0.9) {
      civData.stone.owned += 1;
      gameLog('Found stone while gathering');
    }

    updateResourceTotals();
  }
}
