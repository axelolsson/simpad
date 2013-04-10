// View.js
// -------
define(["jquery", "backbone", "fabric", "collections/Elements", "models/Element", "text!templates/drawing.html"],

    function($, Backbone, Fabric, Elements, Element, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".canvas",
            canvas: null,
            lastTime: 0,

            // View constructor
            initialize: function() {
              var self = this;

              require(["Elements"], function(Elements) {
                this.collection = new Elements();
                this.collection.fetch().done(function(collection){

                  var c = JSON.stringify(collection.pop());

                  self.render();

                  canvas = new fabric.Canvas('drawingCanvas');
                  canvas.setHeight(702);
                  canvas.setWidth(824);
                  canvas.freeDrawingLineWidth = 3;
                  fabric.Object.prototype.cornersize = 30;
                  canvas.observe("object:selected", this.objectSelectedHandler);
                  canvas.loadFromJSON(c);
                });
              });

            },

            // View Event Handlers
            events: {
              "tap .tool":  "selectTool",
              "tap .color": "selectColor",
              "click #save_tool": "saveCanvas",

              "touchend .upper-canvas": "saveState",

            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

            saveCanvas: function(event) {
              var c = canvas.toJSON();

              require(["Elements"], function(Elements) {
                this.collection = new Elements();
                this.model = new Element();

                this.model.set(c);
                this.collection.create(this.model);
                this.model.save();
              });

            },

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
                   var clones = [];

                   var currentGroup = canvas.getActiveGroup();

                   if (canvas.getActiveGroup()) {
                     canvas.getActiveGroup().forEachObject(function (o) {
                       var clone = o.clone();
                       canvas.remove(o);
                       clones.push(clone);
                     });

                     var group = new fabric.Group(clones, {
                       left: currentGroup.left,
                       top: currentGroup.top,
                     });

                     canvas.add(group);
                     canvas.deactivateAllWithDispatch().renderAll();
                     canvas.setActiveGroup();
                     canvas.renderAll();

                   }

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

                objects = canvas._objects;
                currentState = [];

                for (var i = 0; i < objects.length; i++) {
                  currentState.push(objects[i]);
                };

              },

              objectSelectedHandler: function(event) {
                var date = new Date();
                var now = date.getTime();
                if(now - this.lastTime < 500){
                  $("#behavior_panel").panel( "open" );
                }
                this.lastTime = now;

              },

              handleUndo: function() {

                if(canvas._objects.length > 0) {
                  removal = [];

                  for (var i = 0; i < objects.length; i++) {
                    removal.push(objects[i]);
                  };

                  for (var i = 0; i <= removal.length; i++) {
                    canvas.remove($(removal).last()[i]);
                  }

                  removal.pop();
                } else {
                  alert('There\s nothing to undo!');
                }
              },

              handleRedo: function() {
                console.log(currentState);

                for (var i = 0; i <= canvas._objects.length; i++) {
                  canvas.add($(currentState).last()[i]);
                  console.log(i);
                }

              },

        });

        // Returns the View class
        return View;

    }
);