// File render.js
//
// Knows how to render a cellular automatom to a <canvas>.
// Create a renderer by specifying a colour vector for each layer;
// e.g.n `{layer1: {r: 1, g: 0, b: 0.5}}`
// TODO: will need transparency for multiple layers.

module.exports = function(layerColours) {

  /**
   * Renders a cell as a single pixel, at the given scale.
   */
  var cellPixel = function(graphicsContext, palette, cell) {

    // Need integer values for CSS "rgb()" function.
    var rInt = Math.floor(palette.r * cell);
    var gInt = Math.floor(palette.g * cell);
    var bInt = Math.floor(palette.b * cell);
    var colourString = 'rgb(' + rInt + ',' + gInt + ',' + bInt + ')';

    graphicsContext.fillStyle = colourString;
    graphicsContext.fillRect(0, 0, 1, 1);
  };

  /**
   * Render a single cellular automaton layer to the canvas.
   *
   * @param graphicsContext used to render to the canvas
   * @param scale The size of a single cell
   * @param cells The cellular automaton layer to render
   * @param palette The colours to use
   * @param renderCell Function to render a cell given the context, palette, and cell value.
   */
  var renderLayer = function(graphicsContext, scale, palette, cells, renderCell) {

    // TODO: scale to size of canvas.
    for (var i = 0; i < cells.length; i++) {
      for(var j = 0; j < cells[i].length; j++) {

        // TODO: would probably be more efficient to just move around step by step as we draw.
        graphicsContext.resetTransform();
        graphicsContext.scale(scale, scale);
        graphicsContext.translate(i, j);

        renderCell(graphicsContext, palette, cells[i][j]);
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
                  1,
                  layerColours[layer],
                  cellValues[layer],
                  cellPixel);
    };
  };

  return { render : render };
};
