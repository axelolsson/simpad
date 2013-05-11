// DesktopRouter.js
// ----------------
define(["jquery", "backbone", "models/Element", "views/MainView", "views/SimulationView", "views/HeaderView", "collections/Elements"],

    function($, Backbone, Element, MainView, SimulationView, HeaderView, Elements) {

        var DesktopRouter = Backbone.Router.extend({

            initialize: function(options) {

              this.appView = options.appView;

              this.collection = new Elements();
              this.model = new Element();

              /* CustomGroup – Fabric.js custom group to assign custom object with behavior properties for simulation */
              fabric.CustomGroup = fabric.util.createClass(fabric.Group, {
                type: "group",

                initialize: function (options) {
                  options || (options = {});
                  this.callSuper("initialize", options);
                  this.set("simpad", options.simpad || {
                    name: "",
                    type: "",
                    behaviors: {
                        move: {
                          direction: "",
                          speed: ""
                        },
                        rotate: {
                          degrees: null,
                        },
                        circle: {
                          target: null,
                        }
                    }
                  });
                },

                toObject: function () {
                  return fabric.util.object.extend(this.callSuper('toObject'), {
                    simpad: this.get("simpad"),
                  });
                },

                _render: function (ctx) {
                  this.callSuper('_render', ctx);
                }

              });

              fabric.CustomGroup.fromObject = function (object) {
                return new fabric.Group(object.options, object);
              };

              fabric.CustomGroup.async = true;

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
              this.appView.showView(new MainView({collection: this.collection, model: this.model}), new HeaderView());
            },

            simulation: function() {
              this.appView.showView(new SimulationView({collection: this.collection, model: this.model}), new HeaderView());
            }

          });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);