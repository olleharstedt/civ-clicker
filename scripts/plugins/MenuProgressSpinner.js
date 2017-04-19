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
        ['building'],  // Type
        ['normal']   // Subtypes
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
        ['upgrade'],
        ['upgrade']  // Subtypes
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
        ['upgrade', 'building'],  // Type
        ['deity', 'altar']   // Subtypes
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        deitySpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        deitySpinner.onTick();
      });

      // Setup upgrade spinner for conquest upgrades.
      var conquestSpinner = new CivClicker.ProgressSpinner(
        '#conquest-sidemenu-loader',
        ['upgrade'],  // Type
        ['conquest']   // Subtypes
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        conquestSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        conquestSpinner.onTick();
      });

      // Setup upgrade spinner for trade upgrades.
      var tradeSpinner = new CivClicker.ProgressSpinner(
        '#trade-sidemenu-loader',
        ['upgrade'],  // Type
        ['trade']   // Subtypes
      );
      CivClicker.Events.subscribe('global.doPurchase.success', function(info) {
        tradeSpinner.onPurchaseSuccess(info);
      });
      CivClicker.Events.subscribe('global.tick', function() {
        tradeSpinner.onTick();
      });
    }
  };
})();
