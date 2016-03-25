"use strict"

/**
 * @module graphics
 */

/**
 * @class graphics
 */
var graphics = (function(graphics){
	console.log("sprite.js loaded");

	/**
	 * Private Globals
	 */
	var loaded = 0;

	var RED      = 0;
	var GREEN    = 1;
	var BLUE     = 2;
	var ALPHA    = 3;

	/**
	 * Public methods
	 */
	graphics.getLoaded = function(){
		return loaded;
	};

	/**
	 * Description
	 * @class Sprite
	 * @method
	 * @return
	 */
	function Sprite(path){
		loaded++;
		this.img 			= new Image();
		this.img.src 		= path;
		this.img.onload 	= function(){
			loaded--;
		};

		this.canvas 		= document.createElement('canvas');
		this.context 		= this.canvas.getContext('2d');
	}

	/**
	 * Description
	 * @method buildImageData
	 * @return 
	 */
	Sprite.prototype.buildImageData = function(){
		// Adjust the canvas dimensions to those of the image for processing.
		this.canvas.width = this.img.width;
		this.canvas.height = this.img.height;

		this.context.drawImage(
			this.img,
			0, 0, this.img.width, this.img.height,
			0, 0, this.img.width, this.img.height);

		this.imageData 		= this.context.getImageData(0, 0, this.img.width, this.img.height);
		this.data 			= this.imageData.data;
	};

	/**
	 * Description
	 * @method getPixelColor
	 * @param {} x
	 * @param {} y
	 * @return pixel
	 */
	Sprite.prototype.getPixelColor = function(x, y){
        if(this.data === undefined){
            return undefined;	
        }
        
        // Ensure that the input is a round number.
        var it = Math.floor((y * this.img.width * 4) + (x * 4));

		var pixel = new graphics.Pixel(
			this.data[it + RED],
			this.data[it + GREEN],
			this.data[it + BLUE],
			this.data[it + ALPHA]
			);
		return pixel;        
	};

	/**
	 * Description
	 * @method draw
	 * @param {Canvas.context} context
	 * @param {float} x
	 * @param {float} y
	 * @param {float} w
	 * @param {float} h
	 * @parma {float} rotation The ammount an image should be rotated when drawn in degrees.
	 * the function itself converts this to radians when the drawing to the canvas takes place.
	 * @return 
	 */
	Sprite.prototype.draw = function(context, x, y, w, h, rotation){
		var r = rotation || 0;
		r = math.degToRadians(r);

		var ratiow = w/this.img.width;
		var ratioh = h/this.img.height;

		var ratio = ratiow;
		if(ratioh < ratiow){
			ratio = ratioh;
		}

		try{
			var offx = (w - (this.img.width * ratio)) * .5;
			var offy = (h - (this.img.height * ratio)) * .5;

			context.save();

			context.translate((x+offx) + (0.5 * this.img.width * ratio), (y + offy) + (0.5 * this.img.height * ratio));
			context.rotate(r);
			context.translate(-(0.5 * this.img.width * ratio), -(0.5 * this.img.height * ratio));
			context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width * ratio, this.img.height * ratio);

			context.restore();
		} catch (e) {
			console.log(e);
		}
	};

	graphics.Sprite = Sprite;

	return graphics;
})(graphics || {});

