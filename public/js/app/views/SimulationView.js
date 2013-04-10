// View.js
// -------
define(["jquery", "backbone", "fabric", "models/Element", "text!templates/simulating.html"],

    function($, Backbone, Fabric, Model, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".canvas",
            canvas: null,

            // View constructor
            initialize: function() {

              // Calls the view's render method
              this.render();

              canvas = new fabric.StaticCanvas('simulationCanvas');
              canvas.setHeight(623);
              canvas.setWidth(1024);

            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

              // Setting the view's template property using the Underscore template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);

            },

        });

        // Returns the View class
        return View;

    }
);