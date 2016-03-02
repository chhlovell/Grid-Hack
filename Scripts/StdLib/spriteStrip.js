/**
 * @module graphics
 */

"use strict"

/**
 * @class graphics
 */
var graphics = (function(graphics){
	console.log("spriteStrip.js loaded");


	/**
	 * @class SpriteStrip
	 * @constructor
	 * @param {string} path
	 * @param {integer} numFrames
	 * @param {integer} frameWidth
	 * @param {} index
	 */
	function SpriteStrip(path, numFrames, frameWidth, index){
		graphics.Sprite.call(this, path);
		this.numFrames 		= numFrames;
		this.frameWidth 	= frameWidth;
		this.index 			= index;
	}
	SpriteStrip.prototype = Object.create(graphics.Sprite.prototype);

	/**
	 * @method draw
	 * @param {integer || string} frame
	 * @param {Canvas.context} context
	 * @param {integer} x
	 * @param {integer} y
	 * @param {integer} w
	 * @param {integer} h
	 */
	SpriteStrip.prototype.draw = function(frame, context, x, y, w, h){
		var f;
		if(stdlib.isString(frame)){
			f = this.index[frame];
		} else {
			f = frame;
		}
		
		context.drawImage(this.img, f * this.frameWidth, 0, this.frameWidth, this.img.height, x, y, w, h);
	};

	graphics.SpriteStrip = SpriteStrip;
	return graphics;
})(graphics || {});