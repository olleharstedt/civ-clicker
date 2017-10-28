/**
 * Hearth building.
 */
class FreeLand extends Building {

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
        <td></td>
        <td><span class='text-muted'>${reqText}</span></td>
        <td><span class='text-muted'>${this.effectText}</span></td>
      </tr>
    `;
  }

}
