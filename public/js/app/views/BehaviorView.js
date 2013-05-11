// View.js
// -------
define(["jquery", "backbone", "fabric", "models/Element", "text!templates/behaviors.html"],

    function($, Backbone, Fabric, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".behavior",

            // View constructor
            initialize: function(options) {
              _.bindAll(this);
              // Calls the view's render method
              this.render();

//              this.options = options.objects;
              this.eventProxy = options.eventProxy;

              this.objects = canvas.getObjects();
              this.activeObj = canvas.getActiveObject();

              this.inputs = $(this.el).find('input');
              var select = $('#dropdown_circle')[0];
              this.inputs.push(select);
              inputs = this.inputs;

              _.each(inputs, function(v) {
                if(this.activeObj && this.activeObj.simpad) {
                  switch($(v).attr("name")) {
                    case "name":
                      $(v).val(this.activeObj.simpad.name);
                      break;
                    case "type":
                      $(v).val(this.activeObj.simpad.type);
                      break;
                    case "direction":
                      $(v).val(this.activeObj.simpad.behaviors.move.direction);
                      break;
                    case "speed":
                      $(v).val(this.activeObj.simpad.behaviors.move.speed);
                      break;
                    case "degrees":
                      $(v).val(this.activeObj.simpad.behaviors.rotate.degrees);
                      break;
                   default:
                      break;
                  }
                }
              }, this);

            },

            // View Event Handlers
            events: {
              "click .add": "addBehavior",
            },

            // Renders the view's template to the UI
            render: function() {
              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

              return this.el;

            },

            addBehavior: function(e) {
              e.preventDefault();

              $.fn.serializeObject = function() {
                var o = Object.create(null),
                  elementMapper = function(element) {
                    element.name = $.camelCase(element.name);
                    return element;
                  },
                  appendToResult = function(i, element) {
                    var node = o[element.name];

                    if ('undefined' != typeof node && node !== null) {
                      o[element.name] = node.push ? node.push(element.value) : [node, element.value];
                    } else {
                      o[element.name] = element.value;
                    }
                  };

                $.each($.map(this.serializeArray(), elementMapper), appendToResult);
                return o;
              };

              var inp = inputs.serializeObject();

              _.each(inp, function(v, k) {
                if(this.activeObj) {
                  switch(k) {
                    case "name":
                      this.activeObj.simpad.name = v;
                      break;
                    case "type":
                      this.activeObj.simpad.type = v;
                      break;
                    case "direction":
                      this.activeObj.simpad.behaviors.move.direction = v;
                      break;
                    case "speed":
                      this.activeObj.simpad.behaviors.move.speed = v;
                      break;
                    case "degrees":
                      this.activeObj.simpad.behaviors.rotate.degrees = parseFloat(v);
                      break;
                    case "target":
                      this.activeObj.simpad.behaviors.circle.target = v;
                      break;
                   default:
                      break;
                  }
                }
              }, this);
              this.activeObj.set({"simpad": this.activeObj.simpad});

              this.saveBehavior();
              return this.activeObj;

            },

            saveBehavior: function() {
              this.eventProxy.trigger('canvas:save');
            }

        });

        // Returns the View class
        return View;

    }
);