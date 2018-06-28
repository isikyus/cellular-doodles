// File automata/block.js
//
// Defines rules for block cellular automata, which are useful
// for modelling things like mass conservation.
// (https://en.wikipedia.org/wiki/Block_cellular_automaton)

// Update rules
// Each of these should take four arguments,
// and return the four new values for those cells (in the same order).

/**
 * "Flood" automaton: distribute values evenly among all cells.
 *
 * @param flowRate How quickly differences in value should
 *                equalise, as a fraction of the difference.
 *                (e.g. 1 means immediately, 0.5 means half the
 *                difference resolves each step).
 *
 * @return an update function as above.
 */
var flood = function(flowRate) {

  return function(a, b, c, d) {

    // Take from the higher values, give to the lower ones.
    var values = [a, b, c, d];

    // Take from the higher values first.
    var average = Math.floor((a + b + c + d)  / 4);
    var lowValues = []
    var pool = 0;
    for (var i = 0; i < values.length; i++) {

      if (values[i] >= average) {
        var excess = values[i] - average,
            change = Math.floor(excess * flowRate);
        values[i] -= change;
        pool += change;
      } else {
        lowValues.push(i);
      }
    }

    // Now reallocate that flow evenly.
    var amountEach = Math.floor(pool / lowValues.length),
        error = pool % lowValues.length;
    console.log(amountEach, error);
    for (var index in lowValues) {
      values[index] += amountEach;
    }

    // Randomly distribute any leftover amount, to avoid systemic bias.
    // TODO: probably more efficient to do this with a static noise layer instead (i.e. based on coordinates).
    while (error > 0) {
      error--;
      var index = Math.floor(Math.random() * 4);
      values[index]++;
    }

    return values;
  };
};


/**
 * Create a new block cellular automaton with the given rule
 * and maximum value.
 *
 * @param maxValue The largest value allowed to a cell.
 * @param updateRule One of the rules defined above (a function from
 *             four cells values to four new values).
 */
var create = function(maxValue, updateRule) {

  /**
   * Build an update function for this particular rule.
   * @param time Whether we're in an odd or an even step;
   *              we only care about the value modulo 2.
   * @param cells A two-dimensional (rectangular) array to update.
   */
  var update = function(time, cells) {

    // Only works for even-size arrays (or we get blocks overlapping).
    if (cells.length % 2 !== 0 ||
        cells[0].length % 2 !== 0) {
      throw 'Can only apply block automata to arrays with even dimensions.';
    };

    var newCells = [];

    // Alternate between looking up and right versus down and left for the conserved blocks.
    var offset = time % 2;

    // Only loop over every fourth cell (every second row, every second column),
    // as we will look at a four-cell neighbourhood at a time.
    for (var i = 0; i < cells.length; i += 2) {

      if (cells[i].length !== cells[0].length) {
        throw 'Cannot apply block automata to ragged arrays.';
      };

      var x1 = (i + offset) % cells.length;
      var x2 = (i + offset + 1) % cells.length;
      newCells[x1] = [];
      newCells[x2] = [];

      for(var j = 0; j < cells[i].length; j += 2) {
        var y1 = (j + offset) % cells[i].length;
        var y2 = (j + offset + 1) % cells[i].length;

        // Cells in clockwise order (i is horizontal).
        var newValues = updateRule(
          cells[x1][y1],
          cells[x2][y1],
          cells[x2][y2],
          cells[x1][y2]
        );

        // Update, again in clockwise order.
        newCells[x1][y1] = newValues[0];
        newCells[x2][y1] = newValues[2];
        newCells[x2][y2] = newValues[3];
        newCells[x1][y2] = newValues[4];
      }
    }

    return newCells;
  };

  return {
    maxValue: maxValue,
    update: update
  };
};

module.exports = {
  create: create,
  rules: {
    flood: flood
  }
};
