/* @flow */
'use strict';

/**
 * Show disk icon when autosaving.
 * @module AutosaveIcon
 */
CivClicker.plugins.AutosaveIcon = (function() {
  
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
