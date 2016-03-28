"use strict"

/**
 * @module gh
 */


/** 
 * @class gh
 */
var gh = (function(gh){

	/**
	 * @class HQDice
	 * @constructor
	 */
	function HQDice(spriteStrip){
		this.spriteStrip 	= spriteStrip;
		this.sides			= ["blackShield", "whiteShield", "whiteShield", "skull", "skull", "skull"];
	}

	/**
	 * @method draw
	 * @param {string || integer} frame
	 * @param {Canvas.context} context
	 * @param {integer} x
	 * @param {integer} y
	 */
	HQDice.prototype.draw = function(frame, context, x, y){
		this.spriteStrip.draw(frame, context, x, y, this.spriteStrip.frameWidth, this.spriteStrip.img.height);
	};

	/**
	 * @method roll
	 * @return
	 */
	HQDice.prototype.roll = function(){
		var r = Math.floor((Math.random() * 6));
		return this.sides[r];
	};

	gh.hqDice = new HQDice(new graphics.SpriteStrip("./Data/Graphics/hqdice.gif", 6, 100, {"skull" : 3, "whiteShield" : 1, "blackShield" : 0}));

	return gh;
})(gh || {});