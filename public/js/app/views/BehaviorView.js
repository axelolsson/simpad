// View.js
// -------
define(["jquery", "backbone", "fabric", "models/Element",],

    function($, Backbone, Fabric, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: '#behavior_panel',
            canvas: null,

            // View constructor
            initialize: function(options) {
              // Calls the view's render method
              this.render();
              this.template = _.template($('#behavior_panel').html(), {});

              this.options = options;
              console.log(canvas.getObjects());

              this.inputs = $(this.el).find('input');
              inputs = this.inputs;

              _.each(inputs, function(v) {
                if(this.options.active === true) {
                  switch($(v).attr("name")) {
                    case "object_name":
                      $(v).val(this.options.simpad.name);
                      break;
                    case "object_type":
                      $(v).val(this.options.simpad.type);
                      break;
                    case "behavior_move_direction":
                      $(v).val(this.options.simpad.behaviors.move.direction);
                      break;
                    case "behavior_move_speed":
                      $(v).val(this.options.simpad.behaviors.move.speed);
                      break;
                    case "behavior_rotate_speed":
                      $(v).val(this.options.simpad.behaviors.rotate.degrees);
                      break;
                    case "behavior_circle_target":
                      $(v).val(this.options.simpad.behaviors.circle.target);
                      break;
                   default:
                      break;
                  }
                }
              }, this);

            },

            // View Event Handlers
            events: {
              "tap .add": "addBehavior",
              "panelbeforeclose": "addBehavior"
            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

            addBehavior: function() {

              $.fn.serializeObject = function() {
                 var o = {};
                 var a = this.serializeArray();
                 $.each(a, function() {
                     if (o[this.name]) {
                         if (!o[this.name].push) {
                             o[this.name] = [o[this.name]];
                         }
                         o[this.name].push(this.value || '');
                     } else {
                         o[this.name] = this.value || '';
                     }
                 });
                 return o;
              };

              var inp = inputs.serializeObject();

              _.each(inp, function(v, k) {
                if(this.options.active === true) {
                  switch(k) {
                    case "object_name":
                      this.options.simpad.name = v;
                      break;
                    case "object_type":
                      this.options.simpad.type = v;
                      break;
                    case "behavior_move_direction":
                      this.options.simpad.behaviors.move.direction = v;
                      break;
                    case "behavior_move_speed":
                      this.options.simpad.behaviors.move.speed = v;
                      break;
                    case "behavior_rotate_speed":
                      this.options.simpad.behaviors.rotate.degrees = v;
                      break;
                    case "behavior_circle_target":
                      this.options.simpad.behaviors.circle.target = v;
                      break;
                   default:
                      break;
                  }
                }
              }, this);

              return this.options;

              this.saveBehaviors();

            },

            saveBehavior: function() {
              console.log("saving");
              this.options.set({"simpad": {
                name: this.options.simpad.name,
                type: this.options.simpad.type,
                  behaviors: {
                      move: {
                        direction: this.options.simpad.behaviors.move.direction,
                        speed: this.options.simpad.behaviors.move.speed
                      },
                      rotate: {
                        degrees: parseInt(this.options.simpad.behaviors.rotate.degrees),
                      },
                      circle: {
                        target: this.options.simpad.behaviors.circle.target,
                      }
                  }
                }
              });

              console.log(this.options);
              return this.options;

            }
        });

        // Returns the View class
        return View;

    }
);