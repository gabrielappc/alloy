var Alloy = require('alloy'), 
	Backbone = Alloy.Backbone,
	_ = Alloy._;

var Controller = function() {
	var fixArgs = Array.prototype.slice.call(arguments);
	this.__iamalloy__ = true;
	this.__views = [];
	_.extend(this, Backbone.Events, {
		setParent: function(parent) {
			if (parent.__iamalloy__) {
				this.parent = parent.parent;
			} else {
				this.parent = parent;
			}

			for (var i = 0, l = this.__views.length; i < l; i++) {
				if (this.__views[i].__iamalloy__) {
					this.__views[i].setParent(this.parent);
				} else {
					this.parent.add(this.__views[i]);
				}
			}
		},
		pushView: function(view) {
			this.__views.push(view);
		},
		getViews: function() {
			return this.__views;
		},
		getRoot: function() {
			return this.__views[0];
		}
	});
	if (this.__init) { this.__init(); }
	if (this.preLayout) { this.preLayout.apply(this, fixArgs); }
	if (this.__layout) { this.__layout(); }
	if (this.__postLayout) { this.__postLayout.apply(this, fixArgs); }
}
//Controller.extend = Backbone.Model.extend;
// _.extend(Controller.prototype, Backbone.Events, {
// 	setParent: function(parent) {
// 		if (this.root) {
// 			parent.add(this.root);
// 		} 
// 	},
// 	setRoot: function(root) {
// 		this.root = root;
// 	},
// 	getRoot: function() {
// 		return this.root;
// 	}
// });
module.exports = Controller;
