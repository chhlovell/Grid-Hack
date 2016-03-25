"use strict"

/** 
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("level.js loaded");

	/**
	 * @class Level
	 * @constructor
	 * @param {string} name
	 * @param {string} introText
	 */
	function Level(name, introText, maxHeroes, availableHeroes, players, teams, mapData, treasure){
		this.name 				= name || "";
		this.introText 			= introText || "";
		this.maxHeroes 			= maxHeroes || 1;
		this.availableHeroes    = availableHeroes || null;
		this.manager 			= new gh.Manager(players);
		this.teams 				= teams || {};
		this.mapData 			= mapData || null;
		this.treasure			= treasure || {};
	}

	/**
	 * @method drawTriggers
	 * @param {Canvas.context} context
	 * @param {integer} tileSize
	 * @param {float} scale
	 * @return
	 */
	Level.prototype.drawTriggers = function(context, tileSize, scale, offset, team){
		var triggers = this.mapData.triggers;

		for(var it = 0; it < triggers.length; it++){
			triggers[it].draw(context, tileSize, scale, offset);			
		}

		return true;
	};

	/**
	 * @method setupVisibility
	 * @return
	 */
	Level.prototype.setupVisibility = function(){
		this.mapData.map.clearVisibility(false);

		var triggers = this.mapData.triggers;
		var map = this.mapData.map.board;

		// Set the maps initial visibility via the entry triggers.
		for(var it = 0; it < triggers.length; it++){
			if(triggers[it] instanceof gh.EntryTrigger){
				map[triggers[it].y][triggers[it].x].visible["Empire"] = true;
				for(var y = 0; y < map.length; y++){
					for(var x = 0; x < map[y].length;){
						var ray = this.mapData.map.getLine(triggers[it].x, triggers[it].y, x, y);
						this.mapData.map.setRayVisibility(ray, "Empire", true);

						if(y === 0 || y === map.length-1){
							x++;
						} else {
							if(x === 0){
								x = map[y].length-1;	
							} else {
								x = map[y].length;								
							}
						}
					}
				}
			}
		}

		// Center the display on the first entry trigger.
		for(var it = 0; it < triggers.length && !(triggers[it] instanceof gh.EntryTrigger); it++){
		}
		gh.board.centerOn(triggers[it]);
	};

	gh.Level = Level;
	return gh;
})(gh || {});