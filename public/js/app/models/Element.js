// Element.js
// --------
define(["jquery", "backbone", "fabric"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Element = Backbone.Model.extend({

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            },

            // Model Constructor
            initialize: function() {
              console.log('Element model initialized');

              this.on('invalid', function(model, error) {
                console.log(error);
              });

            },
        });

        // Returns the Model class
        return Element;

    }

);
