var buildRenderer = require('./renderer.js'),
    automata = require('./automata.js'),
    ruleTypes = {
      block: require('./automata/block.js')
    };

var SIZE = 100,
    UPDATE_DELAY = 100; // milliseconds

// Build a set of automata from a JSON list of rules.
var buildAutomata = function(ruleListData) {
  var rules = {};

  for (var layer in ruleListData) {
    rules[layer] = buildRule(ruleListData[layer]);
  }

  return automata(rules);
};

// Build a single rule from serialised data.
var buildRule = function(ruleData) {
  var ruleType = ruleTypes[ruleData.type],
      maximum = ruleData.maximum,
      rule = ruleType.rules[ruleData.rule],
      ruleParams = ruleData.parameters;

  return ruleType.create(maximum, rule.apply(null, ruleParams));
};

// Range of each colour channgel (R, G, and B).
var COLOUR_DEPTH = 256;

// Adjust the values in a palette so the full colour range
// will be used for the full allowable range of cells.
// TODO: should probably do this somewhere else.
var scalePalette = function(rawPalette, automata) {
  var scaledPalette = {};
  for (var layer in rawPalette) {

    var scaleFactor = COLOUR_DEPTH /
            automata.ruleInfo(layer).maxValue;
    scaledPalette[layer] = {
      r: rawPalette[layer].r * scaleFactor,
      g: rawPalette[layer].g * scaleFactor,
      b: rawPalette[layer].b * scaleFactor
    };
  }

  return scaledPalette;
}

// Apply a given "layer action"
// (object with an action name and parameters) to the automaton.
// TODO: should probably be in its own file.
var applyAction = function(act, cellValues) {
  switch (act.action) {
    case "set":
      cellValues[act.layer][act.x][act.y] = act.value;
      break;

    default:
      throw "Unknown action: " + act.action;
  }
};

// Set up an automaton for each configured canvas.
document.querySelectorAll('canvas').forEach(function(canvas) {

  // TODO -- assumes canvas is square.
  // Also assuming a 1:1 scale (1 pixel = 1 cell)
  var size = canvas.width,
      data = canvas.dataset;

  var automata = buildAutomata(JSON.parse(data.rules)),
      cellValues = automata.initialModel(size),
      palette = scalePalette(JSON.parse(data.palette), automata),
      renderer = buildRenderer(palette);

  // Time step of simulation -- used for certain rules.
  var time = 0;
  window.setInterval(function() {
    time++;
    cellValues = automata.update(time, cellValues);
    renderer.render(canvas, cellValues);
  }, UPDATE_DELAY);

  renderer.render(canvas, cellValues);

  // Add some inital water so we can see it flow.
  var actions = JSON.parse(data.initial);
  actions.forEach(function(action) {
    applyAction(action, cellValues);
  });

  // Add an on-click action if specified.
  if (data.click) {
    var clickAction = JSON.parse(data.click);
    canvas.onclick = function(event) {

      // TODO: probably not ideal to be mutating the action object.
      clickAction.x = event.pageX - canvas.offsetLeft;
      clickAction.y = event.pageY - canvas.offsetTop;

      applyAction(clickAction, cellValues);
    };
  }
});;
