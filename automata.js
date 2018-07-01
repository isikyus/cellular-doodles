// File automata.js
//
// Keeps track of multiple cellular automaton "layers" with varying rules.

module.exports = function(layers) {

  /**
   * Create an array of cells initialised for the given ruleset(s).
   * @param size The size of the new cellular automaton space.
   * @return an object with a named 2D array for each layer,
   *         each initialised to 0.
   */
  var initialModel = function(size) {
    var model = {};

    for (const layer in layers) {
      if (model[layer]) {
        throw 'Duplicate layer name: ' + layer;
      };

      // Fill in everything with 0.
      model[layer] = [];
      for (var i = 0; i < size; i++) {
        model[layer][i] = [];
        for(var j = 0; j < size; j++) {
          model[layer][i][j] = 0;
        }
      }
    }

    return model;
  };

  /**
   * Calculate the next step of each automata using the given cell values.
   * 
   * @param time The number of steps the algorithm has run for.
   * @param values An object with arrays for each layer, as returned by initialModel().
   * @return A similar object, with states derived from those in the old one.
   */
  var update = function(time, model) {
    var newModel = {};

    for (const layer in layers) {
      newModel[layer] = layers[layer].update(time, model[layer]);
    };

    return newModel;
  };
  
  var ruleInfo = function(layerName) {
    return {
      maxValue: layers[layerName].maxValue
    };
  };

  return {
    initialModel: initialModel,
    update: update,
    ruleInfo: ruleInfo
  };
};
