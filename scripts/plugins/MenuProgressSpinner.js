/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Small plugin that listens to doPurchase and tick to show a spinner if a building
 * is in progress.
 * @module MenuProgressSpinner
 */
CivClicker.MenuProgressSpinner = (function() {

  /**
   * Helper function to create spinners.
   * @param {string} id
   * @param {array} types
   * @param {array} subtypes
   */
  function createSpinner(id, types, subtypes) {
    // Setup building spinner.
    var spinner = new CivClicker.ProgressSpinner(
      id,
      types,
      subtypes
    );
    CivClicker.Events.subscribe('global.doPurchase.success', info => {
      spinner.onPurchaseSuccess(info);
    });
    CivClicker.Events.subscribe('global.tick', () => {
      spinner.onTick();
    });

  }

  return {
    /**
     * Init this plugin.
     * @return
     */
    init: function() {
      // Setup building spinner.
      createSpinner(
        '#buildings-sidemenu-loader',
        ['building'],
        ['normal']
      );

      // Setup spinner for 'upgrade' upgrades.
      createSpinner(
        '#upgrades-sidemenu-loader',
        ['upgrade'],
        ['upgrade']  // Subtypes
      );

      // Setup spinner for deity upgrades and alter buildings.
      createSpinner(
        '#deities-sidemenu-loader',
        ['upgrade', 'building'],  // Type
        ['deity', 'altar']   // Subtypes
      );

      // Setup spinner for conquest upgrades.
      createSpinner(
        '#conquest-sidemenu-loader',
        ['upgrade'],  // Type
        ['conquest']   // Subtypes
      );

      // Setup spinner for trade upgrades.
      createSpinner(
        '#trade-sidemenu-loader',
        ['upgrade'],  // Type
        ['trade']   // Subtypes
      );
    }
  };
})();

// Subscribe to game init event and install the plugin.
$(function() {
  CivClicker.Events.subscribe('global.init', () => {
    CivClicker.MenuProgressSpinner.init();
  });
});
