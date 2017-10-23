/**
 * Hearth building.
 */
class Hearth extends Building {

  /**
   * Run on each tick.
   */
  tick() {
    console.log(this.owned);
  }

  /**
   * @return {string} HTML to put in <td>.
   */
  getUpdateCell() {
  }
}
