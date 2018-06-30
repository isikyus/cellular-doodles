var test = require('tape');
var block = require('../../automata/block.js');

test('flood automaton -- fast', function(t) {
  t.plan(4);

  var fastFlood = block.rules.flood(1),
      quicklyBalanced = fastFlood(2, 4, 6, 8),
      totalAfterBalancing = quicklyBalanced.reduce((a, b) => a + b);
  t.equal(totalAfterBalancing, 2 + 4 + 6 + 8);

  var quickMax = Math.max.apply(Math, quicklyBalanced),
      quickMin = Math.min.apply(Math, quicklyBalanced),
      imbalance = quickMax - quickMin;
  t.ok(imbalance < 3, 'Distributes evenly where fast (got ' + quicklyBalanced + ' -- out by ' + imbalance + ')');

  t.deepEqual(fastFlood(0, 0, 0, 0), [0, 0, 0, 0], 'Does nothing to empty space');

  t.equal(fastFlood(0, 0, 1, 0).reduce((a, b) => a+b), 1,
          'Conserves very small quantities');
});

test('flood automaton -- slow', function(t) {
  t.plan(4);

  var slowFlood = block.rules.flood(0.5),
      slowSharing = slowFlood(1, 10, 10, 100),
      totalAfterSharing = slowSharing.reduce((a, b) => a + b);
  t.equal(totalAfterSharing, 1 + 10 + 10 + 100, 'Preserves total quantity');
  
  var slowMax = Math.max.apply(Math, slowSharing),
      slowMin = Math.min.apply(Math, slowSharing),
      imbalance = slowMax - slowMin;
  t.ok(imbalance < 75, 'Distributes more evenly than before when slow (got ' + slowSharing + ' -- out by ' + imbalance + ')');

  var maxNotLast = slowFlood(0, 0, 191, 0),
      maxNotLastMin = Math.min.apply(Math, maxNotLast);
  t.ok(maxNotLastMin > 0, 'Distributes something to every low cell (got ' + maxNotLast + ')')

  t.deepEqual(slowFlood(0, 0, 0, 0), [0, 0, 0, 0], 'Does nothing to empty space');
});
