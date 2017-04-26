/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Show disk icon when autosaving.
 * @module AutosaveIcon
 */
CivClicker.AutosaveIcon = (function() {
  
  // Event subscription.
  let globalAutosave = null;

  return {

    /**
     * Init plugin.
     */
    init: () => {
      globalAutosave = CivClicker.Events.subscribe('global.autosave', () => {
        $('#save-disk').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        setTimeout(() => {
          $('#save-disk').fadeOut('slow');
        }, 3000);
      });
    },

    /**
     * Unload the plugin.
     */
    unload: () => {
      if (globalAutosave) {
        globalAutosave.remove();
      }
    }
  };
})();

// Subscribe to game init event and install the plugin.
$(function() {
  CivClicker.Events.subscribe('global.init', () => {
    CivClicker.AutosaveIcon.init();
  });
});
