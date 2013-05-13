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

              this.options = options.objects;
              this.eventProxy = options.eventProxy;

              this.inputs = $(this.el).find('input');
              this.select = $('#dropdown_circle')[0];
              this.inputs.push(this.select);
              inputs = this.inputs;

              _.each(inputs, function(v) {
                if(this.options.active === true && this.options.simpad) {
                  switch($(v).attr("name")) {
                    case "name":
                      $(v).val(this.options.simpad.name);
                      break;
                    case "type":
                      $(v).val(this.options.simpad.type);
                      break;
                    case "direction":
                      $(v).val(this.options.simpad.behaviors.move.direction);
                      break;
                    case "speed":
                      $(v).val(this.options.simpad.behaviors.move.speed);
                      break;
                    case "degrees":
                      $(v).val(this.options.simpad.behaviors.rotate.degrees);
                      $('#rangevalue').val($('input[name="degrees"]').val());
                      break;
                    case "target":
                      this.populateDropdown();
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

              console.log(inp);

              _.each(inp, function(v, k) {
                if(this.options.active === true) {
                  switch(k) {
                    case "name":
                      this.options.simpad.name = v;
                      break;
                    case "type":
                      this.options.simpad.type = v;
                      break;
                    case "direction":
                      this.options.simpad.behaviors.move.direction = v;
                      break;
                    case "speed":
                      this.options.simpad.behaviors.move.speed = v;
                      break;
                    case "degrees":
                      this.options.simpad.behaviors.rotate.degrees = parseFloat(v);
                      break;
                    case "target":
                      this.options.simpad.behaviors.circle.target = v;
                      break;
                   default:
                      break;
                  }
                }
              }, this);
              this.options.set({"simpad": this.options.simpad});

              this.saveBehavior();
              return this.options;

            },

            populateDropdown: function() {
              var objects = canvas.getObjects(); // Get all objects on canvas again since we need to manipulate inactive objects

              if(objects) {
                $('#dropdown_circle').empty();
                $('#dropdown_circle').append('<option class="dropdown_circle_target" value="">Choose...</option>');

                output = [];
                inactiveObjects = [];

                while(inactiveObjects.length > 0) {
                  inactiveObjects.pop();
                  output.pop();
                }

                _.each(objects, function(object) {
                  if(object.active === false && object.simpad) {
                    inactiveObjects.push(object);
                  }
                }, this);

                if(inactiveObjects.length !=0) {
                  for(var i = 0, len = inactiveObjects.length; i < len; i++) {
                    output.push('<option class="dropdown_circle_target" value="' + inactiveObjects[i].simpad.name + '">' + inactiveObjects[i].simpad.name + '</option>');
                  }

                  $('#dropdown_circle').append(output.join(''));
                }
              }

              var target = this.options.simpad.behaviors.circle.target;

              $("#dropdown_circle option").filter(function() {
                return this.text == target;
              }).prop('selected', true);

            },

            saveBehavior: function() {
              try {
                this.eventProxy.trigger('canvas:save');
              } catch(e) {
                console.log("Error when triggering save: " + e);
              } finally {
                console.log("Successfully saved");
                this.close();
              }
            }

        });

        // Returns the View class
        return View;

    }
);