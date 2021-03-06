// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		parentArgs = {},
		code = '';

	// Make sure the parent is TabGroup
	if (args.parent.node) {
		parentArgs = CU.getParserArgs(args.parent.node);
	}
	if (parentArgs.fullname !== 'Ti.UI.TabGroup') {
		U.die('Tab must have a TabGroup as a parent');
	}

	// See if the only child is a Window. If not, add it as a container
	// component for all the Tab's children
	var winNode;
	if (children.length !== 1 ||
		CU.getParserArgs(children[0]).fullname !== 'Ti.UI.Window') {
		winNode = U.XML.createEmptyNode('Window');
		for (var i = 0; i < children.length; i++) {
			winNode.appendChild(children[i]);
			node.removeChild(children[i]);
		}
		node.appendChild(winNode);
	} 

	// Generate code for Tab's Window
	var winSymbol;
	code += CU.generateNode(winNode || children[0], {
		parent: {},
		styles: state.styles,
		post: function(n,s,a) {
			winSymbol = s.parent.symbol;
		}
	});

	// Generate the code for the Tab itself, with the Window in it
	code += require('./default').parse(node, {
		parent: {},
		styles: state.styles,
		extraStyle: CU.createVariableStyle('window', winSymbol)
	}).code;

	// Update the parsing state
	return {
		parent: {}, 
		styles: state.styles,
		code: code
	}
};