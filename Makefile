
JS_SOURCES = main.js renderer.js automata.js automata/block.js
TESTS = $(shell find tests -type f -name '*.js')

test : ${JS_SOURCES} ${TESTS}
	node node_modules/.bin/tape ${TESTS}

built.js : ${JS_SOURCES}
	node node_modules/.bin/browserify main.js -o built.js

