// MobileInit.js
// -------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "libs/jquery",

//      "jquerymobile": "libs/jquery.mobile",

      "underscore": "libs/lodash",

      "backbone": "libs/backbone",

      // Plugins
      // -------
      "backbone.localStorage": "libs/plugins/backbone.localStorage.min",
      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "text": "libs/plugins/text",

//      "fabric": "libs/plugins/fabricjs-1.1.6",
      "fabric": "libs/plugins/fabricjs-0.9.15.min",

      "TweenMax": "libs/plugins/TweenMax-1.9.5.min",

      // Application Folders
      // -------------------
      "collections": "app/collections",

      "models": "app/models",

      "routers": "app/routers",

      "templates": "app/templates",

      "views": "app/views"

  },

  // Sets the dependency and shim configurations
  // - Helpful for including non-AMD compatible scripts and managing dependencies
  shim: {
/*
      // jQuery Mobile
      "jquerymobile": ["jquery"],
*/
      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      // Backbone.localStorage plugin that depends on Backbone
      "backbone.localStorage": ["backbone"],

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"]
  }

});

// Include Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "routers/MobileRouter", "backbone.localStorage", "backbone.validateAll"],

  function($, Backbone, MobileRouter) {
/*    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;

    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
*/
    // Instantiates a new Mobile Router instance
    new MobileRouter();

  }

);