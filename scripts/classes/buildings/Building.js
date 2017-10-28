/**
 * Common Properties: type="building",customQtyId
 * @property {string} type      Always "building"
 * @property {string} alignment Always "player"
 * @property {string} place     Always "home"
 * @property {function} vulnerable Returns boolean if this building can be sacked
 * @property {customQtyId} string "buildingCustomQty" ?
 * @property {boolean} useProgressBar If true, will display progress during building
 * @property {number} progressTimeLeft Milliseconds of left building time. 0 means not building.
 */
class Building extends CivObj {

  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    /*
    if (!(this instanceof Building)) {
      return new Building(props);
    }
    CivObj.call(this,props);
    copyProps(this,props,null,true);
    return this;
    */

    this.type             = 'building';
    this.alignment        = 'player';
    this.place            = 'home';
    this.customQtyId      = 'buildingCustomQty';
    this.useProgressBar   = true;
    this.progressTimeLeft = 0;

    CivObj.call(this,props);
    copyProps(this,props,null,true);
  }

  /**
   * Build up UI for buildings.
   */
  static addUITable(buildings) {
    const buildingsTable = $('#buildings');
    if (buildingsTable == null) {
      throw 'Found no buildings table';
    }
    buildings.forEach((building) => {
      if (building.showPurchaseRow()) {
        buildingsTable.append(building.getPurchaseRowHtml());
      }
    });
  }

  /**
   * @return {boolean}
   */
  get vulnerable() {
    // Altars can't be sacked.
    return this.subType != 'altar';
  }

  /**
   * Get the td cell where progress bar will be put.
   * @return {object}
   */
  getProgressBarCell(id) {
    let fullId = '#' + id + 'Row .number';
    let cell = $(fullId);
    if (cell.length > 0) {
      return cell[0];
    }

    // If this is an altar
    fullId = '#' + id + 'Row .buildingtrue';
    cell = $(fullId);
    if (cell.length > 0) {
      return cell[0];
    }

    fullId = '#' + this.getProgressBarCellId();
    cell = $(fullId);
    if (cell.length > 0) {
      return cell[0];
    }

    throw 'Found no cell to put building progress bar in: ' + fullId;
  }

  /**
   * @return {boolean} True if purchase row should be shown.
   */
  showPurchaseRow() {
    return this.owned > 0 || meetsPrereqs(this.prereqs);
  }

  getProgressBarCellId() {
    return this.singular + '-progress-bar-cell';
  }

  /**
   * Build up purchase row building HTML.
   * @return {string} HTML <tr>
   */
  getPurchaseRowHtml() {
    const name = ucfirst(this.singular);
    const reqText = getReqText(this.require);
    const progressBarId = this.getProgressBarCellId();
    return `
      <tr data-target='${this.id}'>
        <td>${name}</td>
        <td id='${progressBarId}' style='width: 100px;'></td>
        <td id='${this.singular}-owned-cell'>${this.owned}</td>
        <td class='building-purchase-cell'><button class='btn btn-default btn-sm x1' data-quantity='1' data-action='purchase' onclick='onPurchase(this)'>+1</button></td>
        <td><span class='text-muted'>${reqText}</span></td>
        <td><span class='text-muted'>${this.effectText}</span></td>
      </tr>
    `;
  }

  /**
   * Update numbers on purchase row.
   */
  updatePurchaseRow() {
    // If the item's cost is variable, update its requirements.
    if (this.hasVariableCost()) {
      updateRequirements(this);
    }
    $('#' + this.singular + '-owned-cell').html(this.owned);
  }

  /**
   * Update effect text.
   */
  update() {
    // TODO: need better way to do this
    $(this.id+'Note').html(': ' + this.effectText);
  }
}
