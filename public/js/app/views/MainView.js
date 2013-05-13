// View.js
// -------
define(["jquery", "backbone", "fabric", "hammer", "models/Element", "collections/Elements", "views/HeaderView", "views/BehaviorView", "text!templates/drawing.html"],

    function($, Backbone, Fabric, Hammer, Element, Elements, HeaderView, BehaviorView, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".content",
            canvas: null,
            lastTime: 0,

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

              this.events = _.extend({}, this.defaultEvents, this.events||{});
              this.render = _.wrap(this.render, function(render) {
                render();
                this.afterRender();
              });
            },

            // Backbone view Event Handlers
            events: {
              "tap .tool":  "selectTool",
              "tap .color": "selectColor",
              "tap #save_tool": "saveCanvas",
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
              var hammer = $('body').hammer({
                swipe_max_touches: 0
              });

              Hammer.plugins.fakeMultitouch();
              Hammer.plugins.showTouches();

              /* EventProxy - An eventdispatcher that allows views to trigger custom events */
              var eventProxy = {};
              _.extend(eventProxy, Backbone.Events);
              this.eventProxy = eventProxy;
              this.eventProxy.on('canvas:save', this.saveCanvas);

              /* Fabric.js canvas setup */
              canvas = new fabric.Canvas('drawingCanvas');

              canvas.setHeight(702);
              canvas.setWidth(824);

              canvas.freeDrawingBrush.width = 3;
              canvas.selectionColor = 'rgba(22, 160, 133, .3)';
              canvas.selectionBorderColor = 'rgba(22, 160, 133, 1)';

              fabric.Object.prototype.borderColor = 'rgba(22, 160, 133, 1)';
              fabric.Object.prototype.cornerColor = 'rgba(22, 160, 133, 1)';
              fabric.Object.prototype.cornerSize = 30;

              if(this.collection.at(0) != null) {
                var c = this.collection.at(0).get("canvas");
                canvas.loadFromJSON(JSON.stringify(c));
              }

              canvas.isDrawingMode = !canvas.isDrawingMode;
              $("#draw_tool").toggleClass('active');
              $(".black").toggleClass('active');

              // Custom event listener for selection of canvas-object
              canvas.on("object:selected", this.objectSelectedHandler);
              canvas.on("selection:cleared", this.objectDeselectedHandler);
              canvas.on("path:created", this.saveState);

            },

            saveCanvas: function(event) {

              var c = canvas.toObject();
              if(_.size(this.collection) === 0) {
                this.collection.create({canvas: c});
              } else {
                var model = this.collection.at(0);
                model.set({canvas: c});
                model.save();
              }


            },

            // Function for handling which tool is selected
            selectTool: function(event) {
               $('.tool').removeClass('active');
               $('.color').removeClass('active');

               currentTool = event.currentTarget;
               currentToolId = currentTool.id;

               switch(currentToolId) {
                 case "draw_tool":
                   canvas.isDrawingMode = !canvas.isDrawingMode;
                   if (canvas.isDrawingMode) {
                     $(currentTool).addClass('active');
                     $(".black").addClass('active');
                   }
                   else {
                     canvas.isDrawingMode = false;
                     $(currentTool).removeClass('active');
                     $(".black").removeClass('active');
                   }
                   break;
                 case "move_tool":
                   canvas.isDrawingMode = false;
                   $(currentTool).toggleClass('active');
                   break;
                 case "clear_tool":
                   $(currentTool).addClass('active');
                   var clearIt = window.confirm("Are you sure?");
                   if(clearIt) {
                     canvas.clear();
                     window.localStorage.clear();
                     $(currentTool).removeClass('active');
                   }
                   break;
                 case "group_tool":
                   $('.group_tool').toggleClass('active');
                   this.handleGroup();
                   break;
                 case "ungroup_tool":
                   this.handleUngroup();
                   break;
                 case "undo_tool":
                   this.handleUndo();
                   break;
                 case "redo_tool":
                   this.handleRedo();
                   break;
                 default:
                   break;
               }
             },

             selectColor: function(event) {

                $('.color').removeClass('active');
                currentColor = event.currentTarget;
                currentColorName = $(currentColor).attr('class').split(' ')[1];

                switch(currentColorName) {
                  case "red":
                    canvas.freeDrawingBrush.color = '#FF0000';
                    $(currentColor).toggleClass('active');
                    break;
                  case "green":
                    canvas.freeDrawingBrush.color = '#008000';
                    $(currentColor).toggleClass('active');
                    break;
                  case "blue":
                    canvas.freeDrawingBrush.color = '#0000FF';
                    $(currentColor).toggleClass('active');
                    break;
                  case "yellow":
                    canvas.freeDrawingBrush.color = '#FFFF00';
                    $(currentColor).toggleClass('active');
                    break;
                  case "black":
                    canvas.freeDrawingBrush.color = '#000000';
                    $(currentColor).toggleClass('active');
                    break;
                  case "brown":
                    canvas.freeDrawingBrush.color = '#A52A2A';
                    $(currentColor).toggleClass('active');
                    break;
                  default:
                    break;
                }

              },

              saveState: function() {

                objects = canvas.getObjects();
                currentState = [];

                for (var i = 0; i < objects.length; i++) {
                  currentState.push(objects[i]);
                };

              },

              objectSelectedHandler: function(event) {

                if(event.target.type === "group") {
                  this.behaviorView = new BehaviorView({objects: event.target, eventProxy: this.eventProxy});
                }
              },

              objectDeselectedHandler: function(event) {
                this.behaviorView.close();
              },

              addClones: function(clones, currentGroup) {

                var currentTop = currentGroup.getTop();
                var currentLeft = currentGroup.getLeft();

                var group = new fabric.CustomGroup(clones, {});

                group.set({
                  "left": currentLeft,
                  "top": currentTop,
                });

                canvas.add(group);
                canvas.discardActiveGroup();
                canvas.renderAll();
              },

              groupGroups: function(currentGroup) {
                var clones = [];

                var currentTop = currentGroup.getTop();
                var currentLeft = currentGroup.getLeft();
                var currentAngle = currentGroup.getAngle();

                currentGroup.forEachObject(function (o) {
                  var topDif = currentTop + o.getTop();
                  var leftDif = currentLeft + o.getLeft();

                  o.getObjects().forEach(function (object) {
                    var clone = object.clone();

                    clone.top += topDif;
                    clone.left += leftDif;
                    clone.angle = 0;

                    canvas.remove(o);
                    canvas.remove(object);
                    clones.push(clone);
                  });
                });
                this.addClones(clones, currentGroup);
              },

              groupPaths: function(currentGroup) {
                var clones = [];

                currentGroup.forEachObject(function (o) {
                    var clone = o.clone();
                    canvas.remove(o);
                    clones.push(clone);
                });

                this.addClones(clones, currentGroup);
              },

              groupMixed: function(currentGroup) {
                var clones = [];

                var currentTop = currentGroup.getTop();
                var currentLeft = currentGroup.getLeft();

                currentGroup.forEachObject(function (obj) {
                  var topDif = currentTop + obj.getTop();
                  var leftDif = currentLeft + obj.getLeft();

                  if(obj.type === "group") {

                    obj.forEachObject(function (o) {
                      var clone = o.clone();

                      clone.top += topDif;
                      clone.left += leftDif;

                      canvas.remove(o);
                      canvas.remove(obj);
                      clones.push(clone);
                    });

                  } else {
                    var clone = obj.clone();

                    clone.top = topDif;
                    clone.left = leftDif;

                    canvas.remove(obj);
                    clones.push(clone);
                  }
                });

                this.addClones(clones, currentGroup);
              },

              handleGroup: function() {
                var currentGroup = canvas.getActiveGroup();
                var group = false;
                var path = false;

                if (currentGroup) {
                    currentGroup.forEachObject(function (o) {
                        if (o.type === 'group') {
                            group = true;
                        } else {
                            path = true;
                        }
                    });

                    if (group && !path) {
                        this.groupGroups(currentGroup);
                    } else if (!group && path) {
                        this.groupPaths(currentGroup);
                    } else {
                        this.groupMixed(currentGroup);
                    }
                }
              },

              handleUngroup: function() {
                var activeObject = canvas.getActiveObject();
                var currentAngle = activeObject.getAngle();
                var currentTop = activeObject.getTop();
                var currentLeft = activeObject.getLeft();

                var currentRadians = currentAngle * (Math.PI / 180);

                if (activeObject) {
                    activeObject.forEachObject(function (o) {
                        var clone = o.clone();

                        clone.top += currentTop;
                        clone.left += currentLeft;

                        canvas.add(clone);
                        canvas.renderAll();
                    });

                    canvas.remove(activeObject);
                }
              },

              handleUndo: function() {
                removal = [];

                for (var i = 0; i < canvas.getObjects().length; i++) {
                  removal.push(objects[i]);
                };

                for (var i = 0; i <= removal.length; i++) {
                  canvas.remove($(removal).last()[i]);
                }

                removal.pop();
              },

              handleRedo: function() {
                try {
                  canvas.add(currentState.shift());
                } catch (e) {
                  alert("Nothing left to redo!");
                }
              }

        });

        // Returns the View class
        return View;

    }
);