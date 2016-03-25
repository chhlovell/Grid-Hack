"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("stateTreasure.js loaded");

	/** 
	 * @class stateTreasure
	 * @constructor
	 * @param {} stateTreasure
	 * @return
	 */
	var stateTreasure = (function(stateTreasure){

		var _state 					= "stateTreasure";

		var STATE_TREASURE 			= document.getElementById("stateTreasure");
		var ST_TITLE				= document.getElementById("stTitle");
		var ST_IMAGE				= document.getElementById("stImage");
		var ST_TEXT					= document.getElementById("stText");

		/**
		 * This method loads the game data into the treasure card screen. 
		 * @method load
		 * @param {gh.Card} card
		 */
		stateTreasure.load = function(card){
			stdlib.dom.setNodeTreeStyle(STATE_TREASURE,"visibility", "visible");

			_state 					= "stateTreasure";
			STATE_TREASURE.onclick 	= gh.stateTreasure.onClick;
			ST_TITLE.innerHTML 		= card.name;
			ST_TEXT.innerHTML 		= card.description;

			var context = ST_IMAGE.getContext("2d");
			if(gh.assets.sprites[card.image]){
				console.log("draw " + card.image);
				gh.assets.sprites[card.image].draw(context, 0, 0, ST_IMAGE.width, ST_IMAGE.height);
			}
		};

		/**
		 * @method update
		 */
		stateTreasure.update = function(){
			console.log(_state);
			return _state;
		};

		/**
		 * @method render
		 */
		stateTreasure.render = function(){

		};

		/**
		 * @event onClick
		 */
		stateTreasure.onClick = function(){
			stdlib.dom.setNodeTreeStyle(STATE_TREASURE,"visibility","hidden");
			_state = "stateGame";
		};

		return stateTreasure;
	})(stateTreasure || {});
	
	gh.stateTreasure = stateTreasure;
	return gh;
})(gh || {})