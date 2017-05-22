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
  let toolsRowTemplate = null;

  $.get('templates/toolsTableRow.html', (template) => {
    toolsRowTemplate = template;
  });

  return {
    init() {
      //tickSub = CivClicker.Events.subscribe('global.tick', () => {
        const availableTools = [];
        const $table = $('#toolsTable');
        $table.html('');

        tools.forEach((tool) => {
          if (meetsPrereqs(tool)) {
            availableTools.push(tool);
          }
        });
        availableTools.forEach((tool) => {
          const s = Mustache.to_html(
            toolsRowTemplate,
            {
              tool: tool,
              owned: civData[tool.name].owned,
              cost: getCostNote(tool),
              ucfirst: () => {
                return (s, render) => {
                  let rendered = render(s);
                  return rendered.charAt(0).toUpperCase() + rendered.slice(1);
                };
              }
            }
          );
          $table.append(s);
        });
      //});
    },

    unload() {
      if (tickSub) {
        tickSub.remove();
      }
    }
  };
})();
