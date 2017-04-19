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
     * Init this module.
     * @return
     */
    init: function() {
      // Setup building spinner.
      var buildingSpinner = new CivClicker.ProgressSpinner('#buildings-sidemenu-loader', 'building');
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        buildingSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        buildingSpinner.onTick();
      });
    }
  };
})();
