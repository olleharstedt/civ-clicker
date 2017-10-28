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
    return `
      <tr data-target='${this.id}'>
        <td>${name}</td>
        <td></td>
        <td id='${this.singular}-owned-cell'>${this.owned}</td>
        <td></td>
        <td></td>
        <td><span class='text-muted'>${this.effectText}</span></td>
      </tr>
    `;
  }

}
