/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Render tooltips for status bar.
 * @module StatusBar
 */
CivClicker.StatusBar = (function() {
  return {
    init: function() {
      CivClicker.Events.subscribe('global.tick', () => {
        // Food
        $('#status-bar-food')
          .attr('title', 'Max: ' + prettify(civData.food.limit))
          .tooltip('fixTitle');

        // Wood
        $('#status-bar-wood')
          .attr('title', 'Max: ' + prettify(civData.wood.limit))
          .tooltip('fixTitle');

        // Stone
        $('#status-bar-stone')
          .attr('title', 'Max: ' + prettify(civData.stone.limit))
          .tooltip('fixTitle');
      });
    }
  };
})();
