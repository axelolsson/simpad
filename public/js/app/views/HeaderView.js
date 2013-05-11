// View.js
// -------
define(["jquery", "backbone", "text!templates/header.html"],

    function($, Backbone, template){

        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".head",

            // View constructor
            initialize: function() {
              _.bindAll(this);

              this.render();

              if(Backbone.history.fragment == "") {
                $(".back").css("display", "none");
                $(".simulate").css("display", "block");
              } else {
                $(".back").css("display", "block");
                $(".simulate").css("display", "none");
              }


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