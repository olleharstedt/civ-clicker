/**
 * Hearth building.
 */
class Hearth extends Building {

  /**
   * Run on each tick.
   */
  tick() {
  }

  /**
   * @return {string} HTML to put in <td>.
   */
  getUpdateCell() {
    return '<b>Hello!</b>';
  }
}
