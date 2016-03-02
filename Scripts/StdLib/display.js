"use strict"

/**
 * @module graphics
 */


/**
 * @class grahpics
 * @constructor
 */
var graphics = (function(graphics){
	console.log("display.js loaded");

	/**
	 * Class Display
	 */
	function Display(divDisplay){
		this.layers = [];
		this.divDisplay = document.getElementById(divDisplay);
	}

	/**
	 * Public methods
	 */


	Display.prototype.addCanvas = function(canvas){
		for(var it = 0; it < this.layers.length && this.layers[it].zindex < canvas.zindex; it++){

		}
		this.layers.splice(it, 0, canvas);
	};

	Display.prototype.onResize = function(e){
		for(var it = 0; it < this.layers.length; it++){
			this.layers[it].resize("0px", "0px", this.divDisplay.clientWidth, this.divDisplay.clientHeight);
		}
	}

	Display.prototype.resize = function(top, left, width, height){
		for(var it = 0; it < this.layers.length; it++){
			this.layers[it].resize(top, left, width, height);
		}
	};

	Display.prototype.onClick = function(){
		for(var it = 0; it < this.layers.length && this.layers[it].onClick().focus === false; it++){

		}
		console.log(it);

	};


	graphics.Display = Display;
	return graphics;
})(graphics || {});
