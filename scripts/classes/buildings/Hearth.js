/**
 * Hearth building.
 */
class Hearth extends Building {

  /**
   * Run on each tick.
   */
  tick() {
    if (this.active) {
      let hearthsOwned = curCiv.hearth.owned;
      if (civData.wood.owned >= hearthsOwned) {
        civData.wood.owned -= hearthsOwned;
        civData.wood.net -= hearthsOwned;
        CivClicker.Events.publish('registry.increase.heat', hearthsOwned);
      } else {
        // No more wood, fire burns down.
        this.active = false;
        $('#' + this.singular + '-activate').prop('checked', false);
      }
    }
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
        <td>
          <div class='checkbox'>
            <label>
              <input id='${this.singular}-activate' type='checkbox' onclick='civData.hearth.onActivate();' />
              Active
            </label>
          </div>
        </td>
        <td id='${progressBarId}' style='width: 100px;'></td>
        <td id='${this.singular}-owned-cell'>${this.owned}</td>
        <td class='building-purchase-cell'><button class='btn btn-default btn-sm x1' data-quantity='1' data-action='purchase' onclick='onPurchase(this)'>+1</button></td>
        <td><span class='text-muted'>${reqText}</span></td>
        <td><span class='text-muted'>${this.effectText}</span></td>
      </tr>
    `;
  }
}
