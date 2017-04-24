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
        CivClicker.Events.subscribe('global.tick', () => {

          var s = Mustache.to_html(
            templates.resources,
            {
              civData: civData,
              round: function() {
                return function(val, render) {
                  let number = render(val);
                  return Math.round(number * 100) / 100;
                };
              }
            }
          );
          $('#sidemenu-resources')
            .attr('title', s)
            .tooltip('fixTitle');
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
