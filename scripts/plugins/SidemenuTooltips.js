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

  /**
   * Resource tooltip
   */
  function initResourceTooltip() {
    $.get('templates/tooltips/sidemenu-resources.html', function(template) {
      templates.resources = template;
    }).then(function () {

      // toggle is used to decide if we can use .tooltip-inner class to change content.
      // Necessary to update tooltip content when it's shown.
      let toggle = false;
      $('#sidemenu-resources').on('show.bs.tooltip', () => { toggle = true; });
      $('#sidemenu-resources').on('hide.bs.tooltip', () => { toggle = false; });

      CivClicker.Events.subscribe('global.tick', () => {

        const s = Mustache.to_html(
          templates.resources,
          {
            civData: civData,
            round: () =>
            // Implicit return
            (val, render) => {
              const number = render(val);
              return Math.round(number * 100) / 100;
            }
          }
        );

        $('#sidemenu-resources').attr('title', s).tooltip('fixTitle');

        if (toggle) {
          $('.tooltip-inner').html(s);
        }
      });
    });
  }

  /**
   * Population tooltip
   */
  function initPopulationTooltip() {
    // Population menu
    $.get('templates/tooltips/sidemenu-population.html', (template) => {
      templates.population = template;
    }).then(() => {

      // toggle is used to decide if we can use .tooltip-inner class to change content.
      // Necessary to update tooltip content when it's shown.
      let toggle = false;
      $('#sidemenu-population').on('show.bs.tooltip', () => { toggle = true; });
      $('#sidemenu-population').on('hide.bs.tooltip', () => { toggle = false; });

      CivClicker.Events.subscribe('global.tick', () => {

        const s = Mustache.to_html(
          templates.population,
          {
            population: population,  // Global var
            unitData: unitData,      // Global var
            happiness: stringOfHappinessRank(getHappinessRank()),
            // Upper-case first letter.
            ucfirst: () => {
              return (s, render) => {
                let rendered = render(s);
                return rendered.charAt(0).toUpperCase() + rendered.slice(1);
              };
            }
          }
        );
        $('#sidemenu-population')
        .attr('title', s)
        .tooltip('fixTitle');

        if (toggle) {
          $('.tooltip-inner').html(s);
        }
      });
    });
  }

  return {
    init: function() {
      initResourceTooltip();
      initPopulationTooltip();
    }
  };
})();

// Subscribe to game init event and install the plugin.
$(function() {
  CivClicker.Events.subscribe('global.init', () => {
    CivClicker.SidemenuTooltips.init();
  });
});
