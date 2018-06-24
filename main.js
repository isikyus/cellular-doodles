var renderer = require('./renderer.js'),
    automata = require('./automata.js'),
    blockCellular = require('./automata/block.js');

var SIZE = 100,
    UPDATE_DELAY = 100; // milliseconds

var water = blockCellular.create(8, blockCellular.rules.flood(0.5));

var rules = automata({ water: water });
var cellValues = rules.initialModel(SIZE);


// Range of each colour channgel (R, G, and B).
var COLOUR_DEPTH = 256;

// Scale the blue colour to the range [0, 256]
// so we use more distinguishable colours.
var renderer = renderer({
  water: {r: 0, g: 0, b: COLOUR_DEPTH / water.maxValue }
});

var canvas = document.getElementById('cells');

var time = 0;
window.setInterval(function() {
  time++;
  cellValues = rules.update(time, cellValues);
  renderer.render(canvas, cellValues);
}, UPDATE_DELAY);


// Add some inital water so we can see it flow.
cellValues.water[50][50] = 255;

// Add water on click.
canvas.onclick = function(event) {
  var canvasX = event.pageX - canvas.offsetLeft;
  var canvasY = event.pageY - canvas.offsetTop;
  var oldValue = cellValues.water[canvasX][canvasY];

  cellValues.water[canvasX][canvasY] = Math.min(oldValue + 100, 255);
};

renderer.render(canvas, cellValues);
