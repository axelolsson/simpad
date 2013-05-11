// MobileRouter.js
// ---------------
define(["jquery", "backbone", "models/Element", "views/MainView", "views/SimulationView", "views/BehaviorView", "collections/Elements"],

    function($, Backbone, Element, MainView, SimulationView, Elements) {

        var MobileRouter = Backbone.Router.extend({

             initialize: function() {
              this.collection = new Elements();
              this.model = new Element();

              this.collection.fetch({
                success : function(collection) {
                  this.collection = collection;
                },
                error: function(e) {
                  console.log("Error when initializing collection: " + e);
                }
              });


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
              new MainView({collection: this.collection});
            },

            simulation: function() {
              new SimulationView({collection: this.collection});
            }

        });

        // Returns the MobileRouter class
        return MobileRouter;

    }

);