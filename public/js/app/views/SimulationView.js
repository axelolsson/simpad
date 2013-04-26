// View.js
// -------
define(["jquery", "backbone", "fabric", "collections/Elements", "models/Element", "text!templates/simulating.html"],

    function($, Backbone, Fabric, Elements, Element, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".canvas",
            canvas: null,

            // View constructor
            initialize: function() {

              // Calls the view's render method
              this.render();

              canvas = new fabric.StaticCanvas('simulationCanvas');
              canvas.setHeight(623);
              canvas.setWidth(1024);

              require(["Elements"], function(Elements) {

                this.collection = new Elements();

                this.collection.fetch().done(function(collection) {

                  var c = JSON.stringify(collection.pop());
                  canvas.loadFromJSON(c);

                });

              });

            },

            // View Event Handlers
            events: {
              "tap .play":  "playAnimation",
              "tap .stop": "stopAnimation"
            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

            animateObject: function(objects) {

              (function animate() {
                _.each(objects, function(obj) {
                  obj.setAngle(15 + obj.getAngle());

               }, this);
                  canvas.renderAll();
                  fabric.util.requestAnimFrame(animate);
              })();

            },

            playAnimation: function(e) {
              e.preventDefault();
              console.log("Play the animation");

              var objects = canvas.getObjects();
              this.animateObject(objects);

            },

            stopAnimation: function(e) {
              e.preventDefault();
              console.log("Stop the animation");
            }

        });

        // Returns the View class
        return View;

    }
);