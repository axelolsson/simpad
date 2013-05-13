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

//      "jquerymobile": "libs/jquery.mobile",

      "underscore": "libs/lodash",

      "backbone": "libs/backbone",

      "hammer": "libs/hammer",

      // Plugins
      // -------
      "backbone.touch": "libs/plugins/backbone.touch",

      "backbone.localStorage": "libs/plugins/backbone.localStorage.min",

      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "text": "libs/plugins/text",

      "fabric": "libs/plugins/fabricjs-1.1.12",

      "TweenMax": "libs/plugins/TweenMax-1.9.5.min",

      "TimelineMax": "libs/plugins/TimelineMax-1.9.5.min",

      "jquery.hammer": "libs/plugins/jquery.hammer",

      "hammer.fakemultitouch": "libs/plugins/hammer.fakemultitouch",

      "hammer.showtouches": "libs/plugins/hammer.showtouches",

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
        "exports": "Backbone",

      },

      // Backbone.localStorage plugin that depends on Backbone
      "backbone.localStorage": ["backbone"],

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"],

//      "jquerymobile": ["jquery"],

      "jquery.hammer": ["jquery", "hammer"],

      "hammer.fakemultitouch": ["hammer"],

      "hammer.showtouches": ["hammer"],

      "TimelineMax": ["TweenMax"]

  }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "backbone", "routers/DesktopRouter", "backbone.localStorage", "backbone.validateAll", "hammer", "jquery.hammer", "hammer.fakemultitouch", "hammer.showtouches"],

  function($, Backbone, DesktopRouter) {

    Backbone.View.prototype.close = function () {
      console.log('Unbinding events for ' + this.cid);
      this.$el.empty();
      this.unbind();
      this.undelegateEvents();

      if (this.onClose) {
        this.onClose();
      }
    };

    var AppView = Backbone.View.extend({
      el: $(".content"),

      showView: function(view){
        var closingView = this.view;

        this.view = view;
        this.view.render();
        $(this.view.el).hide();
        this.$el.append(this.view.el);

        this.openView(this.view);
        this.closeView(closingView);
      },

      openView: function(view){
        $(view.el).fadeIn("fast");
        view.delegateEvents();
      },

      closeView: function(view){
        if (view){
          view.unbind();
          view.undelegateEvents();
        }
      }
    });

    // Instantiates a new Desktop Router instance
    new DesktopRouter({appView: new AppView()});

  }

);