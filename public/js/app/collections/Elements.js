// Elements.js
// -------------
define("Elements", ["jquery","backbone","models/Element","backbone.localStorage"],

  function($, Backbone, Element, localStorage) {

    // Creates a new Backbone Collection class object
    var Elements = Backbone.Collection.extend({

      // Model Constructor
      initialize: function() {
        console.log('Element collection initialized');

        this.on('invalid', function(collection, error) {
          console.log(error);
        });

      },

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Element,

      localStorage: new Backbone.LocalStorage("simpad-ls") // Unique name within your app.

    });

    // Returns the Model class
    return Elements;

  }

);