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
        'building'
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        buildingSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        buildingSpinner.onTick();
      });

      // Setup upgrade spinner.
      var upgradeSpinner = new CivClicker.ProgressSpinner(
        '#upgrades-sidemenu-loader',
        'upgrade'
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        upgradeSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        upgradeSpinner.onTick();
      });
    }
  };
})();
