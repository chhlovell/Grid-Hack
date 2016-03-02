"use strict"

var graphics = (function(graphics){
	console.log("fps.js loaded");

	var fps = (function(fps){

		fps.last = Date.now();
		fps.delta = 0;

		fps.getFPS = function(){
			var time = Date.now();
			fps.delta = Math.floor(1000/(time - fps.last));
			fps.last = time;

			return fps.delta;
		};

		return fps;
	})(fps || {});

	graphics.fps = fps;

	return graphics;
})(graphics || {});