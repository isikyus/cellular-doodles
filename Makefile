
built.js : main.js renderer.js automata.js automata/block.js
	node node_modules/.bin/browserify main.js -o built.js

