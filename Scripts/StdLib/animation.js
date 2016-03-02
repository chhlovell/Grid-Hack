"use strict"

/** 
 * @module graphics
 */

/**
 * @class graphics
 */
var graphics = (function(graphics){
	console.log("animation.js loaded");

	/**
	 * This animation class is depreciated with respect to the Grid Hack engine.
	 * @class Animation
	 * @depreciated
	 * @param {string} path
	 * @param {integer} numFrames
	 * @param {integer} frameWidth
	 * @param {bool} repeat
	 * @param {float} speed The time in milliseconds between each frame.
	 * @param {} index This parameter is optional
	 */
	function Animation(path, numFrames, frameWidth, repeat, speed, index){
		graphics.SpriteStrip.call(this, path, numFrames, frameWidth, index);

		this.repeat				= repeat;
		this.speed				= speed;
		this.currentFrame 		= 0;
		this.delta 				= 0;
		this.start 				= -1; // When the animation is initialized.
		this.dt 				= 0; // elapsed time.
	}
	Animation.prototype = Object.create(graphics.SpriteStrip.prototype);

	/**
	 * @method draw
	 * @param {Canvas.context} context
	 * @param {integer} x
	 * @param {integer} y
	 * @param {integer} w
	 * @param {integer} h
	 */
	Animation.prototype.draw = function(context, x, y, w, h){
		if(this.start === -1){
			this.start = Date.now();
		}

		this.dt = Date.now();

		if((this.dt - this.start) > this.speed){
			this.currentFrame++;
			this.start = Date.now();
			if(this.currentFrame >= this.numFrames){
				if(this.repeat){
					this.currentFrame = 0;
				} else {
					this.currentFrame = this.numFrames - 1;
				}
			}
		}

		graphics.SpriteStrip.prototype.draw.call(this, this.currentFrame, context, x, y, w, h);
	};


	graphics.Animation = Animation;

	return graphics;
})(graphics || {});