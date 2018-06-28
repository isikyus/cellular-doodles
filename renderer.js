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
    // TODO: don't have enough scaling info here if we want to use the raw colour.
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

  var renderGrid = function(context, scale, width, height) {
    context.strokeStyle = 'white';
    for (var i = 0; i < width; i++) {
      context.resetTransform();
      context.strokeRect(i * scale, 0, 1, height * scale);
    }
    for (var j = 0; j < height; j++) {
      context.resetTransform();
      context.strokeRect(0, j * scale, width * scale, 1);
    }
  };

  var cellNumber = function(context, palette, cell) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, 1, 1);

    context.fillStyle = 'white';
    context.textBaseline = 'top';
    context.textAlign = 'center';
    context.font = '1px monospaced';
    context.fillText(cell, 0.5, 0, 1);
  };

  /**
   * Render a single layer in "debug" mode, showing cell values as
   * numbers.
   *
   * @param layer The name of the layer to debug;
   * @param scale The size in pixels of each cell.
   */
  var debugRender = function(canvas, cellValues, layer, scale) {
    var context = canvas.getContext('2d');

    renderLayer(context, scale,
                layerColours[layer],
                cellValues[layer],
                cellNumber);

    renderGrid(context, scale,
               cellValues[layer].length,
               cellValues[layer][0].length);
  };

  return {
    render : render,
    debug : debugRender
  };
};
