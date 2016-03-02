"use strict"

var gh = (function(gh){
	console.log("animation.js loaded");

	function Animation(id, numFrames, frameWidth, repeat, speed, index){
		this.id 			= id;
		this.numFrames		= numFrames;
		this.frameWidth		= frameWidth;
		this.repeat			= repeat;
		this.speed			= speed;
		this.index			= index;  // Optional

		this.currentFrame	= 0;
		this.start			= -1;
		this.dt				= 0;
	}

	Animation.prototype.draw = function(imageAssets, context, x, y, w, h){
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
					this.currentFrame = this.numFrames -1;
				}
			}
		}

		imageAssets[this.id].draw(this.currentFrame, context, x, y, w, h);
	};

	/**
	 * @method getPixelAt
	 * @param {float} x The relative position of the mouse x coordinate with respect to a cell's boundaries.
	 * @param {float} y The relative position of the mouse y coordinate with respect to a cell's boundaries.
	 * @param {float} tileSize The size of each cell in the display at a scale of 1.
	 */
	Animation.prototype.getPixelAt = function(x, y, tileSize, sprites){
		var sprite = sprites[this.id];
		var ratioX = tileSize / this.frameWidth;
		var ratioY = tileSize / sprite.img.height;

		// account for the differnece between the tile size and actual image dimensions
		x = x / ratioX;
		y = y / ratioY;

		// account for the frame which is active
		x = x + (this.currentFrame * this.frameWidth);

		var pixel = sprite.getPixelColor(x, y);

		return pixel;
	};

	gh.Animation = Animation;

	return gh;
})(gh || {});