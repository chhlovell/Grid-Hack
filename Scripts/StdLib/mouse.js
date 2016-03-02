"use strict"

var input = (function(input){
	console.log("mouse.js loaded");

	var mouse = (function(mouse){

		mouse.x = 0;
		mouse.y = 0;
		mouse.clicked = false;

		mouse.onMouseMove = function(evt){
			mouse.x = evt.clientX;
			mouse.y = evt.clientY;
		}

		mouse.onClick = function(evt){
			mouse.x = evt.clientX;
			mouse.y = evt.clientY;
			mouse.clicked = true;
		}

		mouse.print = function(){
			console.log("x: " + this.x + " y: " + this.y + " clicked: " + this.clicked);
		}

		return mouse;
	})(mouse || {});

	input.mouse = mouse;
	
	return input;
})(input || {});