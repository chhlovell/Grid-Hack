"use strict"

/**
 * @module graphics
 */


/**
 * @class graphics
 */
var graphics = (function(graphics){
	console.log("canvas2d.js loaded");

	/**
	 * @class Canvas2D
	 * @constructor
	 * @param {string} canvasId The Id of the canvas DOM object.
	 * @param {string} top The top pixel coordinate of the canvas DOM object.
	 * @param {string} left The left pixel coordiante of the canvas DOM object.
	 * @param {integer} width The pixel width of the canvas DOM object.
	 * @param {integer} height The pixel height of the canvas DOM object.
	 * @param {integer} zindex The depth of the canvas DOM object.
	 */
	function Canvas2D(canvasId, top, left, width, height){
		this.canvas 			= document.getElementById(canvasId);
		this.canvas.style.top 	= top || "0px";
		this.canvas.style.left	= left || "0px";
		this.canvas.width 		= width || 300;
		this.canvas.height 		= height || 300;

		this.context 			= this.canvas.getContext('2d');

		this.zindex 			= getComputedStyle(this.canvas, null).zIndex;
		this.focus 				= false;
	}

	/**
	 * @method resize
	 * @param {string} top
	 * @param {string} left
	 * @param {integer} width
	 * @param {integer} height
	 * @return
	 */
	Canvas2D.prototype.resize = function(top, left, width, height){
		this.canvas.width = width;
		this.canvas.height = height;
		return true;
	};

	/**
	 * @method onClick
	 * @return
	 */
	Canvas2D.prototype.onClick = function(){
		return true;
	};


	graphics.Canvas2D = Canvas2D;


	return graphics;
})(graphics || {});