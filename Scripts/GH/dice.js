"use strict"

var gh = (function(gh){

	function Dice(sides, spriteStrip, canvas, context){
		this.sides = sides;
		this.spriteStrip = spriteStrip;
		this.canvas = canvas;
		this.context = context;
	}

	Dice.prototype.draw = function(side, x, y, w, h){
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.spriteStrip.draw(side, this.context, x, y, w, h);
	};

	Dice.prototype.clear = function(){
		this.context.save();
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.restore();
	};

	Dice.prototype.roll = function(){
		return Math.floor((Math.random() * this.sides) + 1);
	};

	gh.Dice = Dice;

	return gh;
})(gh || {});