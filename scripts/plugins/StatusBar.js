/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Small plugin that listens to doPurchase and tick to show a spinner if a building
 * is in progress.
 * @module StatusBar
 */
CivClicker.StatusBar = (function() {
  return {
    init: function() {
      CivClicker.Events.subscribe('global.tick', () => {
        $('#status-bar-food')
          .attr('title', 'Max: ' + prettify(civData.food.limit))
          .tooltip('fixTitle');
      });
    }
  };
})();

// Subscribe to game init event and install the plugin.
$(function() {
  CivClicker.Events.subscribe('global.init', () => {
    CivClicker.StatusBar.init();
  });
});
