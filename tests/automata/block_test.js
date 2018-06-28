var test = require('tape');
var block = require('../../automata/block.js');

test('flood automaton -- fast', function(t) {
  t.plan(2);

  var fastFlood = block.rules.flood(1),
      quicklyBalanced = fastFlood(2, 4, 6, 8),
      totalAfterBalancing = quicklyBalanced.reduce((a, b) => a + b);
  t.equal(totalAfterBalancing, 2 + 4 + 6 + 8);

  var quickMax = Math.max.apply(Math, quicklyBalanced),
      quickMin = Math.min.apply(Math, quicklyBalanced),
      imbalance = quickMax - quickMin;
  t.ok(imbalance < 3, 'Distributes evenly where fast (got ' + quicklyBalanced + ' -- out by ' + imbalance + ')');
});

test('flood automaton -- slow', function(t) {
  t.plan(2);

  var slowFlood = block.rules.flood(0.5),
      slowSharing = slowFlood(1, 10, 10, 100),
      totalAfterSharing = slowSharing.reduce((a, b) => a + b);
  t.equal(totalAfterSharing, 1 + 10 + 10 + 100, 'Preserves total quantity');
  
  var slowMax = Math.max.apply(Math, slowSharing),
      slowMin = Math.min.apply(Math, slowSharing),
      imbalance = slowMax - slowMin;
  t.ok(imbalance < 75, 'Distributes more evenly than before when slow (got ' + slowSharing + ' -- out by ' + imbalance + ')');
});
