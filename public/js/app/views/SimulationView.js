// View.js
// -------
define(["jquery", "backbone", "fabric", "TweenMax", "models/Element", "collections/Elements", "views/HeaderView", "text!templates/simulating.html"],

    function($, Backbone, Fabric, TweenMax, Element, Elements, HeaderView, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",
            canvas: null,

            // View constructor
            initialize: function(options) {
              _.bindAll(this);

              this.collection = options.collection;
              this.model = options.model;
              this.tl = new TimelineMax({repeat: -1});

              this.collection.fetch({
                success : function(collection) {
                  this.collection = collection;
                },
                error: function(e) {
                  console.log("Error when initializing collection: " + e);
                }
              });

              this.render = _.wrap(this.render, function(render) {
                render();
                this.afterRender();
              });
            },

            // View Event Handlers
            events: {
              "click .play":  "playAnimation",
              "click .pause": "pauseAnimation",
              "click .reset": "resetAnimation",
            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

              return this.el;

            },

            afterRender: function() {

              canvas = new fabric.StaticCanvas('simulationCanvas');
              canvas.setHeight(623);
              canvas.setWidth(1024);
              canvas.centerTransform = true;

              /* Backbone initial collection fetch from localStorage */
              if(this.collection.at(0) != null) {
                var c = this.collection.at(0).get("canvas");
                canvas.loadFromJSON(JSON.stringify(c));
              }
            },

            animateObject: function() {
              var objects = canvas.getObjects();

              _.each(objects, function (obj) {
                var currentBehaviors = obj.simpad.behaviors;
/*
                if(currentBehaviors["move"]) {
                  var newVar = obj.getLeft() + 100;

                  doMove();

                  function doMove() {
                    moveTween = TweenMax.to(obj, 1.5, {left: newVar, ease:Linear.easeNone, onComplete:doMove});
                  }
                }
*/
                if (currentBehaviors["rotate"].degrees != 0) {
                  var newAngle = obj.getAngle() + currentBehaviors["rotate"].degrees;

                  doRotate();

                  function doRotate() {
                    rotateTween = TweenMax.to(obj, 2, {angle: newAngle, onComplete:doRotate});
                  }
                }

                if(currentBehaviors["circle"].target != "") {
                  _.each(objects, function (o) {
                    if(o.simpad.behaviors.circle.target != currentBehaviors["circle"].target) {
                    }
                  });
                }


              }, this);


              canvas.renderAll();

           },

            playAnimation: function(e) {
              e.preventDefault();
              console.log("Playing");
              TweenMax.ticker.addEventListener("tick", this.animateObject);
//              this.tl.play();
            },

            pauseAnimation: function(e) {
              e.preventDefault();
              console.log("Paused");
              TweenMax.ticker.removeEventListener("tick", this.animateObject);
//              this.tl.pause();
            },

            resetAnimation: function(e) {
              e.preventDefault();
              console.log("Resetted");
              this.tl.restart();
            }

        });

        // Returns the View class
        return View;

    }
);