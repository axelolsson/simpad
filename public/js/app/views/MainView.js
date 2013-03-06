// View.js
// -------
define(["jquery", "backbone", "fabric", "models/Model", "text!templates/drawing.html"],

    function($, Backbone, Fabric, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".canvas",
            canvas: null,

            // View constructor
            initialize: function() {

              // Calls the view's render method
              this.render();

              canvas = new fabric.Canvas('myCanvas');
              canvas.setHeight(702);
              canvas.setWidth(824);

              fabric.Object.prototype.cornersize = 30;

              canvas.freeDrawingLineWidth = 3;

            },

            // View Event Handlers
            events: {
              "click .tool":  "selectTool",
              "click .color": "selectColor",
            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

           selectTool: function(event) {
              $('.tool').removeClass('active');
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
                case "erase_tool":
                  canvas.isDrawingMode = false;
                  $(currentTool).addClass('active');
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

        });

        // Returns the View class
        return View;

    }

);