"use strict"

/**
 * @module StdLib
 */

/**
 * @class math
 * @param {} math
 */
var math = (function(math){
	console.log("math.js loaded");

	/**
	 * This function converts degrees to radians.
	 * @method degToRadians
	 * @param {floast} deg
	 * @return
	 */
	math.degToRadians = function(deg){
		return deg * Math.PI / 180;
	}

	return math;
})(math || {});