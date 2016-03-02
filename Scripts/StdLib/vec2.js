"use strict"

/**
 * @module StdLib
 */

/**
 * @class math
 */
var math = (function(math){
	console.log("vec2.js loaded");

	/** 
	 * @class Vec2
	 * @constructor
	 * @param {float} x
	 * @param {float} y
	 */
	function Vec2(x, y){
		this.x = x;
		this.y = y;
	}

	math.Vec2 = Vec2;

	return math;
})(math || {});