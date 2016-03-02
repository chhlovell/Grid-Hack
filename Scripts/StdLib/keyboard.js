"use strict"

/**
 * @module input
 */

/** 
 * @class input
 */
var input = (function(input){
	console.log("keyboard.js loaded");

	/** 
	 * @class keyboard
	 */
	var keyboard = (function(keyboard){

		/**
		 * global constants
		 */
		keyboard.SPACE		= 32;

		keyboard.LEFT		= 37;
		keyboard.UP 		= 38;
		keyboard.RIGHT		= 39;
		keyboard.DOWN 		= 40;

		keyboard.A			= 65;
		keyboard.D 			= 68;		
		keyboard.S 			= 83;
		keyboard.W			= 87;

		keyboard.PLUS 		= 187;
		keyboard.MINUS		= 189;

		keyboard.key = {};

		/**
		 * @event keyDown
		 * @param {} evt
		 */
		keyboard.keyDown = function(evt){
			keyboard.key[evt.keyCode] = keyboard.key[evt.keyCode] || {};
			if(keyboard.key[evt.keyCode].pressed === true){
				keyboard.key[evt.keyCode].repeat = true;
			}
			keyboard.key[evt.keyCode].pressed = true;
		};

		/**
		 * @event keyUp
		 * @param {} evt
		 */
		keyboard.keyUp = function(evt){
			keyboard.key[evt.keyCode] = keyboard.key[evt.keyCode] || {};
			keyboard.key[evt.keyCode].pressed = false;
			keyboard.key[evt.keyCode].repeat = false;
		}

		/**
		 * @method isPressed
		 * @param {integer} key ASCII key stroke value
		 */
		keyboard.isPressed = function(key){
			if(keyboard.key[key] && keyboard.key[key].pressed){
				return true;
			} 

			return false;
		};

		/**
		 * @method isRepeat
		 * @param {integer} key ASCII key stroke value
		 */
		keyboard.isRepeat = function(key){
			if(keyboard.key[key] && keyboard.key[key].repeat){
				return true;
			} 

			return false;			
		}

		return keyboard;
	})(keyboard || {});

	input.keyboard = keyboard;

	return input;
})(input || {});