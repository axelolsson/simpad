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
/*
              "click .zoomin": "zoomInCanvas",
              "click .zoomout": "zoomOutCanvas",
              "click .zoomreset": "zoomResetCanvas",
*/
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
              this.tl = new TimelineMax();

              canvas = new fabric.StaticCanvas('simulationCanvas');
              canvas.setHeight(623);
              canvas.setWidth(1024);

              /* Backbone initial collection fetch from localStorage */
              if(this.collection.at(0) != null) {
                var c = this.collection.at(0).get("canvas");
                canvas.loadFromJSON(JSON.stringify(c));
              }

              this.objects = canvas.getObjects();
              this.currentBehaviors = [];
              this.currentTargets = [];

              _.each(this.objects, function (obj){
                this.currentBehaviors.push(obj.simpad.behaviors);
              }, this);

              _.each(this.objects, function (obj){
                this.currentTargets.push(obj.simpad.name);
              }, this);

              console.log(this.currentBehaviors);
              console.log(this.currentTargets);
            },

            animateObject: function() {
/*
                if(currentBehaviors["move"]) {
                  var newVar = obj.getLeft() + 100;

                  doMove();

                  function doMove() {
                    moveTween = TweenMax.to(obj, 1.5, {left: newVar, ease:Linear.easeNone, onComplete:doMove});
                  }
                }


*/
                _.each(this.objects, function(obj, i) {

                  if (this.currentBehaviors[i]["rotate"].degrees != 0) {

                    var newAngle = obj.getAngle() + this.currentBehaviors[i]["rotate"].degrees;

                    doRotate();
                    function doRotate() {
                      rotateTween = TweenMax.to(obj, 2, {angle: newAngle, onComplete:doRotate});
                    }

                  }

                  if(this.currentBehaviors[i]["circle"]["target"] != "") {
                    angle = fabric.util.degreesToRadians(obj.getAngle() + 2);


                    _.find(this.objects, function(obj) {
                      var res = obj["simpad"]["name"] === this.currentBehaviors[i]["circle"]["target"];
                      if(res === true) {
                        cx = obj.getLeft();
                        cy = obj.getTop();
                        radius = obj.getWidth() + obj.getWidth() * .7;
                      }
                    }, this);

                    doCircle();

                    function doCircle() {
                      var x = cx + radius * Math.cos(angle);
                      var y = cy + radius * Math.sin(angle);
  //                    var x = (cx + radius) * Math.cos(angle) + (cy + radius) * Math.sin(angle);
  //                    var y = (cx + radius) * Math.cos(angle) - (cy + radius) * Math.sin(angle);

                      circleTween = TweenMax.to(obj, 2, {left: x, top: y, onComplete: doCircle});

                    }
                  }

              }, this);

              canvas.renderAll();

           },

            playAnimation: function(e) {
              e.preventDefault();
              console.log("Playing");
              TweenMax.ticker.addEventListener("tick", this.animateObject);
            },

            pauseAnimation: function(e) {
              e.preventDefault();
              console.log("Paused");
              TweenMax.ticker.removeEventListener("tick", this.animateObject);
            },

            resetAnimation: function(e) {
              e.preventDefault();
              console.log("Resetted");
            },
/* WIP – Actually scales objects = bad
            zoomInCanvas: function(e) {
              e.preventDefault();
              console.log("Zoom In");

              if(this.canvasScale < 2.9)
               {
                  canvasScale = this.canvasScale * this.SCALE_FACTOR;

                  var objects = canvas.getObjects();

                  for (var i in objects) {
                      var scaleX = objects[i].scaleX;
                      var scaleY = objects[i].scaleY;
                      var left = objects[i].left;
                      var top = objects[i].top;

                      var tempScaleX = scaleX * this.SCALE_FACTOR;
                      var tempScaleY = scaleY * this.SCALE_FACTOR;
                      var tempLeft = left * this.SCALE_FACTOR;
                      var tempTop = top * this.SCALE_FACTOR;

                      objects[i].scaleX = tempScaleX;
                      objects[i].scaleY = tempScaleY;
                      objects[i].left = tempLeft;
                      objects[i].top = tempTop;

                      objects[i].setCoords();
                  }

                  canvas.renderAll();
              }
            },

            zoomOutCanvas: function(e) {
              e.preventDefault();
              console.log("Zoom Out");
              if(this.canvasScale > 0.61)
              {

                  canvasScale = this.canvasScale / this.SCALE_FACTOR;

                  var objects = canvas.getObjects();
                  for (var i in objects) {
                      var scaleX = objects[i].scaleX;
                      var scaleY = objects[i].scaleY;
                      var left = objects[i].left;
                      var top = objects[i].top;

                      var tempScaleX = scaleX * (1 / this.SCALE_FACTOR);
                      var tempScaleY = scaleY * (1 / this.SCALE_FACTOR);
                      var tempLeft = left * (1 / this.SCALE_FACTOR);
                      var tempTop = top * (1 / this.SCALE_FACTOR);

                      objects[i].scaleX = tempScaleX;
                      objects[i].scaleY = tempScaleY;
                      objects[i].left = tempLeft;
                      objects[i].top = tempTop;

                      objects[i].setCoords();
                  }

                  canvas.renderAll();
              }
            },

            zoomResetCanvas: function(e) {
              e.preventDefault();
              console.log("Zoom Reset");
              var objects = canvas.getObjects();
                for (var i in objects) {
                    var scaleX = objects[i].scaleX;
                    var scaleY = objects[i].scaleY;
                    var left = objects[i].left;
                    var top = objects[i].top;

                    var tempScaleX = scaleX * (1 / canvasScale);
                    var tempScaleY = scaleY * (1 / canvasScale);
                    var tempLeft = left * (1 / canvasScale);
                    var tempTop = top * (1 / canvasScale);

                    objects[i].scaleX = tempScaleX;
                    objects[i].scaleY = tempScaleY;
                    objects[i].left = tempLeft;
                    objects[i].top = tempTop;

                    objects[i].setCoords();
                }

                canvas.renderAll();

                canvasScale = 1;
            }
*/
        });

        // Returns the View class
        return View;

    }
);