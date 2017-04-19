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

  return {
    /**
     * Init this plugin.
     * @return
     */
    init: function() {
      // Setup building spinner.
      var buildingSpinner = new CivClicker.ProgressSpinner(
        '#buildings-sidemenu-loader',
        'building',  // Type
        'normal'     // Subtype
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        buildingSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        buildingSpinner.onTick();
      });

      // Setup upgrade spinner for 'upgrade' upgrades.
      var upgradeSpinner = new CivClicker.ProgressSpinner(
        '#upgrades-sidemenu-loader',
        'upgrade',
        'upgrade'
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        upgradeSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        upgradeSpinner.onTick();
      });

      // Setup upgrade spinner for deity upgrades.
      var deitySpinner = new CivClicker.ProgressSpinner(
        '#deities-sidemenu-loader',
        'upgrade',  // Type
        'deity'     // Subtype
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        deitySpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        deitySpinner.onTick();
      });
    }
  };
})();
