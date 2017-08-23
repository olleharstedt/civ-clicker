/**
 * Main entry point.
 */
$(function () {

  // Before ANYTHING else happens, we want to load config.json.
  $.ajax({
    type: 'GET',
    url:  'config.json',
    cache: false,
    success: (config) => {
      // All good.
      serverSettings = config;

      $('#version').html(serverSettings.system.version);
      
      if (serverSettings.system.debug) {
        // Enable debug functionality.
        ruinFun = () => {
          //Debug function adds loads of stuff for free to help with testing.
          civData.food.owned += 1000000;
          civData.wood.owned += 1000000;
          civData.stone.owned += 1000000;
          civData.barn.owned += 5000;
          civData.woodstock.owned += 5000;
          civData.stonestock.owned += 5000;
          civData.herbs.owned += 1000000;
          civData.skins.owned += 1000000;
          civData.ore.owned += 1000000;
          civData.leather.owned += 1000000;
          civData.metal.owned += 1000000;
          civData.piety.owned += 1000000;
          civData.gold.owned += 10000;
          renameRuler('Cheater');
          calculatePopulation();
          updateAll();
        };

      } else {
        // TODO: Prevent cheating?
      }
    },
    error: () => {
      // Die horribly.
      alert('Error: Could not find configuration file - CivClicker is not correctly setup on the server.');
      throw 'No config.json found';
    }
  }).then(() => {

    setup.all();

    // Logger
    // TODO: Use multiple logger for different categories.
    Logger.useDefaults();
    Logger.setLevel(Logger.ALL);

    // Load templates
    setup.templates();

    // Load pages
    setup.pages().then(() => {
      // Only setup plugins AFTER pages are loaded.
      setup.initPlugins(serverSettings.plugins);
      setup.tooltip();
    });

    $('#wrapper').toggleClass('toggled');

    // Sidemenu clicking
    $('.show-page').on('click', function(ev) {
      ev.preventDefault();

      var targetPages = $(ev.target).data('page').split(',');
      $('.page').hide();
      for (var i = 0; i < targetPages.length; ++i) { 
        var targetPage = targetPages[i];
        $('#page-' + targetPage).show();
      }
      $('.show-page').parent().removeClass('active');
      $(ev.target).parent().addClass('active');
    });

  });
});

