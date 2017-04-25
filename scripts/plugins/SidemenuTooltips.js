/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * Render tooltips for sidemenu.
 * @module SidemenuTooltips
 */
CivClicker.SidemenuTooltips = (function() {
  var templates = {};
  return {
    init: function() {
      $.get('templates/tooltips/sidemenu-resources.html', function(template) {
        templates.resources = template;
      }).then(function () {

        // toggle is used to decide if we can use .tooltip-inner class to change content.
        // Necessary to update tooltip content when it's shown.
        let toggle = false;
        $('#sidemenu-resources').on('show.bs.tooltip', () => { toggle = true; });
        $('#sidemenu-resources').on('hide.bs.tooltip', () => { toggle = false; });

        CivClicker.Events.subscribe('global.tick', () => {

          let s = Mustache.to_html(
            templates.resources,
            {
              civData: civData,
              round: () =>
                // Implicit return
                (val, render) => {
                  let number = render(val);
                  return Math.round(number * 100) / 100;
                }
            }
          );
          $('#sidemenu-resources')
            .attr('title', s)
            .tooltip('fixTitle');

          if (toggle) {
            $('.tooltip-inner').html(s);
          }
        });
      });
    }
  };
})();

// Subscribe to game init event and install the plugin.
$(function() {
  CivClicker.Events.subscribe('global.init', () => {
    CivClicker.SidemenuTooltips.init();
  });
});
