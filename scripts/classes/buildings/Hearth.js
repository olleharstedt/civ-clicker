/**
 * Hearth building.
 */
class Hearth extends Building {

  /**
   * Run on each tick.
   */
  tick() {
    let hearthsOwned = curCiv.hearths.owned;
    civData.wood -= hearthsOwned;
  }

  /**
   * @return {string} HTML to put in <td>.
   */
  getUpdateCell() {
    return '<b>Hello!</b>';
  }
}
