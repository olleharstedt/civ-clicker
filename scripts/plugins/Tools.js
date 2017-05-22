/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Show tools table
 * @module Tools
 */
CivClicker.Tools = (function() {
  let tickSub = null;
  return {
    init() {
      tickSub = CivClicker.Events.subscribe('global.tick', () => {
        const availableTools = [];
        const $table = $('#toolsTable');
        $table.html('');

        tools.forEach((tool) => {
          if (meetsPrereqs(tool)) {
            availableTools.push(tool);
          }
        });
        availableTools.forEach((tool) => {
          $table.append('<tr><td>asd</td></tr>');
        });
      });
    },

    unload() {
      if (tickSub) {
        tickSub.remove();
      }
    }
  };
})();
