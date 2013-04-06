// DesktopInit.js
// --------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "libs/jquery",

      "jquerymobile": "libs/jquery.mobile",

      "underscore": "libs/lodash",

      "backbone": "libs/backbone",

      // Plugins
      // -------
      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "text": "libs/plugins/text",

      "fabric": "libs/plugins/fabricjs-0.9.15.min",

      // Application Folders
      // -------------------
      "collections": "app/collections",

      "models": "app/models",

      "routers": "app/routers",

      "templates": "app/templates",

      "views": "app/views"

  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"]
  }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "routers/DesktopRouter", "jquerymobile", "backbone.validateAll"],

  function($, Backbone, DesktopRouter) {

    // Instantiates a new Desktop Router instance
    new DesktopRouter();

  }

);