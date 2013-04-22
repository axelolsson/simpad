// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "models/Element", "views/MainView", "views/SimulationView", "collections/Elements"],

    function($, Backbone, Element, MainView, SimulationView, Elements) {

        var DesktopRouter = Backbone.Router.extend({

            initialize: function() {

              // Tells Backbone to start watching for hashchange events
              Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {

                // When there is no hash on the url, the home method is called
                "": "index",
                "simulate": "simulation",

            },

            index: function() {

                // Instantiates a new view which will render the header text to the page
                new MainView();

            },

            simulation: function() {
              $.mobile.changePage(new SimulationView());
            },
        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);