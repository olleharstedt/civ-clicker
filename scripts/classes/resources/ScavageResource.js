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
}
