// View.js
// -------
define(["jquery", "backbone", "fabric", "models/Element", "text!templates/behaviors.html"],

    function($, Backbone, Fabric, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: '#behavior_panel',
            canvas: null,

            // View constructor
            initialize: function(options) {

              // Calls the view's render method
              this.render();

              this.options = options;

              this.inputs = $(this.el).find('input');
              inputs = this.inputs;

              _.each(inputs, function(input) {
                if($(input).attr('name') === 'element_name') {
                  $(input).val(options.element_name);
                } else if ($(input).attr('name') === 'element_type') {
                  $(input).val(options.element_type);
                }
              });

            },

            // View Event Handlers
            events: {
              "tap .add": "addBehavior",
            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

            addBehavior: function() {
              _.each(inputs, function(input) {
                if($(input).attr("name") === "element_name") {
                  this.options.set({"element_name": $(input).val()});
                } else if ($(input).attr("name") === "element_type") {
                  this.options.set({"element_type": $(input).val()});
                }
              }, this);

              return this.options;

            }

        });

        // Returns the View class
        return View;

    }
);