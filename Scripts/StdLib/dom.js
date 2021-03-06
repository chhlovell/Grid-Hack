
/**
 * @module stdlib
 */

/**
 * @class stdlib
 */
var stdlib = (function(stdlib){
	console.log("dom.js loaded");

	/**
	 * @class dom
	 */
	var dom = (function(dom){

		/**
		 * Sets a style element of a DOM node and all of its children to a given value.
		 * @method setNodeTreeStyle
		 * @param {} node
		 * @param {string} paramater
		 * @param {string} value
		 */
		dom.setNodeTreeStyle = function(node, paramater, value){
			node.style[paramater] = value;
			for(var it = 0; it < node.children.length; it++){
				dom.setNodeTreeStyle(node.children[it], paramater, value);
			}
		};

		/**
		 * This method removes all the children of a specified node.
		 * @method removeChildren
		 * @param {} node
		 */
		dom.removeChildren = function(node){
			while(node.children.length > 0){
				node.removeChild(node.children[0]);
			}
		};

		return dom;
	})(dom || {});

	stdlib.dom = dom;

	return stdlib;
})(stdlib || {});