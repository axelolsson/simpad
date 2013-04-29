// View.js
// -------
define(["jquery", "backbone", "fabric", "collections/Elements", "models/Element", "views/BehaviorView", "text!templates/drawing.html"],

    function($, Backbone, Fabric, Elements, Element, BehaviorView, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".canvas",
            canvas: null,
            lastTime: 0,

            // View constructor
            initialize: function() {
              _.bindAll(this);

              var self = this;
              self.render();

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
                    simpad: this.get('simpad')
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

              canvas = new fabric.Canvas('drawingCanvas');

              canvas.setHeight(702);
              canvas.setWidth(824);

              canvas.freeDrawingLineWidth = 3;
              canvas.selectionColor = 'rgba(0,255,0,0.3)';
              canvas.selectionBorderColor = 'green';

              fabric.Object.prototype.borderColor = 'green';
              fabric.Object.prototype.cornerColor = 'green';
              fabric.Object.prototype.cornersize = 30;

              require(["Elements"], function(Elements) {

                this.collection = new Elements();

                this.collection.fetch().done(function(collection) {

                  var c = JSON.stringify(collection.pop());
                  canvas.loadFromJSON(c);

                });

              });

              // Custom event listeners
              canvas.observe("object:selected", self.objectSelectedHandler);

            },

            // View Event Handlers
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

            saveCanvas: function(event) {
              // Save the canvas to JSON with the custom simpad object
              var c = canvas.toJSON(["simpad"]);

              try {
                require(["Elements"], function(Elements) {
                  this.collection = new Elements();
                  this.model = new Element(c);

                  this.collection.create(this.model);
                  this.model.save();
                });
              } catch(e) {
                alert('Error occured ' + e);
              } finally {
                alert('All done');
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
                   canvas.isDrawingMode = true;
                   $(currentTool).addClass('active');
                   break;
                 case "move_tool":
                   canvas.isDrawingMode = false;
                   $(currentTool).addClass('active');
                   break;
                 case "clear_tool":
                   $(currentTool).addClass('active');
                   if (confirm('Are you sure?')) {
                     canvas.clear();
                   }
                   $(currentTool).removeClass('active');
                   break;
                 case "group_tool":
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
                    canvas.freeDrawingColor = '#FF0000';
                    $(currentColor).addClass('active');
                    break;
                  case "green":
                    canvas.freeDrawingColor = '#008000';
                    $(currentColor).addClass('active');
                    break;
                  case "blue":
                    canvas.freeDrawingColor = '#0000FF';
                    $(currentColor).addClass('active');
                    break;
                  case "yellow":
                    canvas.freeDrawingColor = '#FFFF00';
                    $(currentColor).addClass('active');
                    break;
                  case "black":
                    canvas.freeDrawingColor = '#000000';
                    $(currentColor).addClass('active');
                    break;
                  case "brown":
                    canvas.freeDrawingColor = '#A52A2A';
                    $(currentColor).addClass('active');
                    break;
                  default:
                    break;
                }

              },

              saveState: function() {
/*
                objects = canvas._objects;
                currentState = [];

                for (var i = 0; i < objects.length; i++) {
                  currentState.push(objects[i]);
                };
*/
              },

              objectSelectedHandler: function(event) {

                var date = new Date();
                var now = date.getTime();
                if(now - this.lastTime < 500){
                  this.behaviorView = new BehaviorView(event.target);
                  $("#behavior_panel").panel("open");
                }
                this.lastTime = now;

              },

              addClones: function(clones, currentGroup) {

                var currentTop = currentGroup.getTop();
                var currentLeft = currentGroup.getLeft();

                var group = new fabric.CustomGroup(clones, {});

                group.set({
                  "left": currentLeft,
                  "top": currentTop
                });

                canvas.add(group);
                canvas.discardActiveGroup();
                canvas.renderAll();
              },

              groupGroups: function(currentGroup) {
                var clones = [];

                var currentTop = currentGroup.getTop();
                var currentLeft = currentGroup.getLeft();

                currentGroup.forEachObject(function (o) {
                  var topDif = currentTop + o.getTop();
                  var leftDif = currentLeft + o.getLeft();

                  o.getObjects().forEach(function (object) {
                    var clone = object.clone();

                    clone.top += topDif;
                    clone.left += leftDif;

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

              handleUndo: function() {},

              handleRedo: function() {},

        });

        // Returns the View class
        return View;

    }
);