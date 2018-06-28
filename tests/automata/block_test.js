var test = require('tape');
var block = require('../../automata/block.js');

test('flood automaton', function(t) {
  t.plan(2);

  var flood = block.rules.flood(0.5);

  t.equal(flood(2, 4, 6, 8), [5, 5, 5, 5], 'Distributes evenly where possible');
  
  var approxSharing = flood(1, 2, 3, 4);
  var totalAfterSharing = approxSharing.reduce((a, b) => a + b);
  t.equal(totalAfterSharing, 1 + 2 + 3 + 4, 'Preserves total quantity');
});
