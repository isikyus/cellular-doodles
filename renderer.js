// File render.js
//
// Knows how to render a cellular automatom to a <canvas>.
// Create a renderer by specifying a colour vector for each layer;
// e.g.n `{layer1: {r: 1, g: 0, b: 0.5}}`
// TODO: will need transparency for multiple layers.

module.exports = function(layerColours) {

  /**
   * Render a single cellular automaton layer to the canvas.
   * 
   * @param graphicsContext used to render to the canvas
   * @param cells The cellular automaton layer to render
   * @param palette The colours to use
   */
  var renderLayer = function(graphicsContext, palette, cells) {

    // TODO: scale to size of canvas.
    for (var i = 0; i < cells.length; i++) {
      for(var j = 0; j < cells[i].length; j++) {

        // Need integer values for CSS "rgb()" function.
        var rInt = Math.floor(palette.r * cells[i][j]);
        var gInt = Math.floor(palette.g * cells[i][j]);
        var bInt = Math.floor(palette.b * cells[i][j]);
        var colourString = 'rgb(' + rInt + ',' + gInt + ',' + bInt + ')';

        graphicsContext.fillStyle = colourString;
        graphicsContext.fillRect(i, j, 1, 1);
      }
    }
  };

  /**
   * @param canvas <canvas> element. Must be the same size as the automata.
   * @param cellValues object containing cellular automata values for each layer
   *              Only the keys named when creating the renderer will be rendered.
   */
  var render = function(canvas, cellValues) {
    for (var layer in layerColours) {
      renderLayer(canvas.getContext('2d'),
                  layerColours[layer],
                  cellValues[layer]);
    };
  };

  return { render : render };
};
