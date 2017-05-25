/* @flow */
'use strict';

/**
 * Count number of primary resource clicks.
 * @module CountClicks
 */
CivClicker.plugins.CountClicks = (function() {
  let countClicksSub = null;

  return {

    /**
     * Init the plugin.
     */
    init: function() {
      countClicksSub = CivClicker.Events.subscribe('global.onIncrement', () => {
        $('#clicks').html(prettify(Math.round(++curCiv.resourceClicks)));
      });
    },

    /**
     * Unload this plugin by removing the sub.
     */
    unload: function() {
      if (countClicksSub) {
        countClicksSub.remove();
      }
    }
  };
})();
