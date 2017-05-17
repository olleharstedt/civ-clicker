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
        tools.forEach((tool) => {
          if (meetsPrereqs(tool)) {
            availableTools.push(tool);
          }
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
