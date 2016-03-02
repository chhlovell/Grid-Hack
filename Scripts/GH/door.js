"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("door.js loaded");

	/**
	 * @class Door
	 * @constructor
	 * @param {integer} x
	 * @param {integer} y
	 * @param {string} side Values can include "top" "left" "right" "bottom".
	 * @param {bool} open
	 */
	function Door(x, y, side, open, imageStates){
		this.x				= x;
		this.y				= y;
		this.side 			= side;
		this.open 			= open || false;

		this.focus 			= false; // Is mouse currently over the door.
		this.imageStates	= imageStates;
	}

	/**
	 * @method draw
	 * @param {Canvas.context} context
	 * @param {integer} x
	 * @param {integer} y
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 */
	Door.prototype.draw = function(context, tileSize, scale, offset){
		var img;

		// Determine which image for display based on the door's state.
		if(this.open){
			if(this.focus){
				img = this.imageStates.openDoorHighlight;
			} else {
				img = this.imageStates.open;
			}
		} else {
			if(this.focus){
				img = this.imageStates.closedHighlight;
			} else {
				img = this.imageStates.closed;
			}
		}

		context.save();

		switch(this.side){
			case "top":
				gh.assets.sprites[img].draw(
					context,
					this.x * tileSize * scale + offset.x,
					this.y * tileSize * scale - (0.5 * scale * gh.assets.sprites[img].img.height) + offset.y,
					tileSize * scale,
					gh.assets.sprites[img].img.height * scale
				);
				break;
			case "left":
				context.translate(this.x * tileSize * scale + offset.x, this.y * tileSize * scale + offset.y);
				context.rotate(math.degToRadians(90));
				gh.assets.sprites[img].draw(
					context,
					0,
					0 - (0.5 * scale * gh.assets.sprites[img].img.height),
					tileSize * scale,
					gh.assets.sprites[img].img.height * scale
				);
				break;
			default:
				break;
		}

		context.restore();

		return;
	};

	/**
	 * @method isMouseOver
	 * @param {float} relx
	 * @param {float} rely
	 * @param {string} side
	 * @param {float} tileSize
	 * @param {} sprites
	 * @return
	 */
	Door.prototype.isMouseOver = function(relx, rely, side, tileSize, sprites){
		var img;
		if(this.open){
			if(this.focus){
				img = this.imageStates.openDoorHighlight;
			} else {
				img = this.imageStates.open;
			}
		} else {
			if(this.focus){
				img = this.imageStates.closedHighlight;
			} else {
				img = this.imageStates.closed;
			}
		}

		var imgHeight = sprites[img].img.height;
		var imgWidth = sprites[img].img.width;

		var dx;
		var dy;

		var x;
		var y;

		switch(side){
			case "top":
				y = rely + (0.5 * imgHeight);
				x = relx;
				break;
			case "bottom":
				dy = tileSize - (0.5 * imgHeight);
				y = rely - dy;
				x = relx;
				break;
			case "left":
				x = rely;
				y = relx + (0.5 * imgHeight);
				break;
			case "right":
				x = rely;
				dx = tileSize - (0.5 * imgHeight);
				y = relx - dx;
				break;
			default:
				break;
		}

		var pixel = sprites[img].getPixelColor(x, y);

		if(pixel.isTransparent()){
			return false;
		} else {
			return true;
		}
	};

	/**
	 * @method isClicked
	 * @return
	 */
	Door.prototype.isClicked = function(relx, rely, side, tileSize, sprites){
		/**
		 * Determine which image should be checked
		 * This code is a bit brute force.
		 * May need to consider including a door state variable which points to the relevant
		 * image in the imageState variable.
		 */
		
		var img;
		if(this.open){
			if(this.focus){
				img = this.imageStates.openDoorHighlight;
			} else {
				img = this.imageStates.open;
			}
		} else {
			if(this.focus){
				img = this.imageStates.closedHighlight;
			} else {
				img = this.imageStates.closed;
			}
		}

		var imgHeight = sprites[img].img.height;
		var imgWidth = sprites[img].img.width;

		var dx;
		var dy;

		var x;
		var y;

		switch(side){
			case "top":
				y = rely + (0.5 * imgHeight);
				x = relx;
				break;
			case "bottom":
				dy = tileSize - (0.5 * imgHeight);
				y = rely - dy;
				x = relx;
				break;
			case "left":
				x = rely;
				y = relx + (0.5 * imgHeight);
				break;
			case "right":
				x = rely;
				dx = tileSize - (0.5 * imgHeight);
				y = relx - dx;
				break;
			default:
				break;
		}

		var pixel = sprites[img].getPixelColor(x, y);

		return !pixel.isTransparent();
	}

	gh.Door = Door;

	return gh;
})(gh || {});