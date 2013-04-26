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

      "backbone.localStorage": "libs/plugins/backbone.localStorage.min",
      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "text": "libs/plugins/text",

//      "fabric": "libs/plugins/fabricjs-1.1.6",
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

      "jquerymobile": {
        "deps": ['jquery']
      },

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone",

      },

      // Backbone.localStorage plugin that depends on Backbone
      "backbone.localStorage": ["backbone"],

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"]

  }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "routers/DesktopRouter", "jquerymobile", "backbone.localStorage", "backbone.validateAll"],

  function($, Backbone, DesktopRouter) {

    // Disable jQM routing and component creation events
     // disable hash-routing
     $.mobile.hashListeningEnabled = false;
     // disable anchor-control
     $.mobile.linkBindingEnabled = false;
     // can cause calling object creation twice and back button issues are solved
     $.mobile.ajaxEnabled = false;
     // Otherwise after mobileinit, it tries to load a landing page
     $.mobile.autoInitializePage = false;
     // we want to handle caching and cleaning the DOM ourselves
     $.mobile.page.prototype.options.domCache = false;

  // consider due to compatibility issues
     // not supported by all browsers
     $.mobile.pushStateEnabled = false;
     // Solves phonegap issues with the back-button
     $.mobile.phonegapNavigationEnabled = true;
     //no native datepicker will conflict with the jQM component
     $.mobile.page.prototype.options.degradeInputs.date = true;

     $.mobile.defaultPageTransition = "none";
     $.mobile.defaultDialogTransition = "none";

    // Instantiates a new Desktop Router instance
    new DesktopRouter();

  }

);