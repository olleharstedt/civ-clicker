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

          // Since prettify did not work in template.
          civData.stone.owned = Math.round(civData.stone.owned * 100) / 100;
          civData.piety.owned = Math.round(civData.stone.owned * 100) / 100;

          var s = Mustache.to_html(
            templates.resources,
            {
              civData: civData,
              prettify: prettify  // Does not work?
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
