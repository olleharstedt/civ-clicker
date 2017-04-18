/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Small plugin that listens to doPurchase and tick to show a spinner if a building
 * is in progress.
 * @module menuProgressSpinner
 */
CivClicker.menuProgressSpinner = (function() {
  var buildingTimeLeft = 0;
  var removeBuildingCheck = false;

  // Hook into purchase.
  CivClicker.events.subscribe('global.doPurchase.success', function(info) {

    if (info.purchaseObj instanceof Building) {

      // Always pick the highest time left.
      if (info.progressTime > buildingTimeLeft) {
        buildingTimeLeft = info.progressTime;
      }

      if (removeBuildingCheck) {
        removeBuildingCheck = false;
        $('#buildings-sidemenu-loader').removeClass('fa fa-check');
      }

      $('#buildings-sidemenu-loader').show().addClass('fa fa-spinner fa-pulse');
    }
  });

  // Hook into global tick.
  CivClicker.events.subscribe('global.tick', function() {
    if (buildingTimeLeft > 0) {
      buildingTimeLeft -= 1000;
    }

    if (removeBuildingCheck) {
      removeBuildingCheck = false;
      $('#buildings-sidemenu-loader').fadeOut('slow', function() {
        $('#buildings-sidemenu-loader').removeClass('fa fa-check');
      });
    }

    if (buildingTimeLeft < 0) {
      $('#buildings-sidemenu-loader')
        .removeClass('fa fa-spinner fa-pulse')
        .addClass('fa fa-check');

      // Remove the check next tick.
      removeBuildingCheck = true;

      // Never less than 0.
      buildingTimeLeft = 0;
    }
  });
})();
