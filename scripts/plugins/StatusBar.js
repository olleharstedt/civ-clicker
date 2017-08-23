/* @flow */
'use strict';

/**
 * Render tooltips for status bar.
 * @module StatusBar
 */
CivClicker.plugins.StatusBar = (function() {
  return {
    init: function() {
      CivClicker.Events.subscribe('global.tick', () => {
        // Food
        $('#navbar-food').html(shortify(curCiv.food.owned));
        $('#navbar-food-net').html((civData.food.net < 0 ? '' : '+') +shortify(civData.food.net));
        $('#navbar-food-net').css('color', getNetColor(civData.food.net));
        $('#status-bar-food')
          .attr('title', 'Max: ' + shortify(civData.food.limit))
          .tooltip('fixTitle');

        // Wood
        $('#navbar-wood').html(shortify(curCiv.wood.owned));
        $('#navbar-wood-net').html((civData.wood.net < 0 ? '' : '+') +shortify(civData.wood.net));
        $('#navbar-wood-net').css('color', getNetColor(civData.wood.net));
        $('#status-bar-wood')
          .attr('title', 'Max: ' + shortify(civData.wood.limit))
          .tooltip('fixTitle');

        // Stone
        $('#navbar-stone').html(shortify(curCiv.stone.owned));
        $('#navbar-stone-net').html((civData.stone.net < 0 ? '' : '+') +shortify(civData.stone.net));
        $('#navbar-stone-net').css('color', getNetColor(civData.stone.net));
        $('#status-bar-stone')
          .attr('title', 'Max: ' + shortify(civData.stone.limit))
          .tooltip('fixTitle');

        // Culture
        if (curCiv.culture.owned > 0) {
          $('#navbar-culture').html(
            '<span class="badge">'
            + shortify(curCiv.culture.owned))
            + '</span>';
          $('#status-bar-culture')
            .attr('title', 'Purchase upgrades for your culture points.')
            .tooltip('fixTitle');
        } else {
          $('#navbar-culture').html(shortify(curCiv.culture.owned));
        }
      });
    }
  };
})();
