"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("wall.js loaded");

	/**
	 * @class Wall
	 * @constructor
	 * @param {Bool} passable
	 * @param {Bool} transparent
	 */
	function Wall(x, y, side, passable, transparent){
		this.x				= x;
		this.y				= y;
		this.side 			= side;
		this.passable 		= passable || false;
		this.transparent 	= transparent || false;
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
	Wall.prototype.draw = function(context, tileSize, scale, offset){
		context.strokeStyle = "grey";
		context.lineWidth = 8 * scale;
		context.beginPath();
		switch(this.side){
			case "top":
				context.moveTo(this.x * tileSize * scale + offset.x, this.y * tileSize * scale + offset.y);
				context.lineTo(this.x * tileSize * scale + (tileSize * scale) + offset.x, this.y * tileSize * scale + offset.y);
				break;
			case "left":
				context.moveTo(this.x * tileSize * scale + offset.x, this.y * tileSize * scale + offset.y);
				context.lineTo(this.x * tileSize * scale + offset.x, this.y * tileSize * scale + (tileSize * scale) + offset.y);
				break;
			default:
				break;
		}
		context.stroke();
	};

	/**
	 * @method isMouseOver
	 */
	Wall.prototype.isMouseOver = function(){
		return false;
	}

	/**
	 * @method isClicked
	 */
	Wall.prototype.isClicked = function(){
		return false;
	}
	
	gh.Wall = Wall;
	return gh;
})(gh || {});