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
	 * @method isVictory
	 * @param {string} team The name of the team in question.
	 * @return
	 */
	Level.prototype.isVictory = function(team){
		var vConditions = this.teams[team].victory;

		for(var it = 0; it < vConditions.length; it++){
			switch(vConditions[it].goal){
				case "kill":
					console.log(vConditions[it].target);
					switch(vConditions[it].target){
						case "agent":
							for(var hl = 0; hl < vConditions[it].hitList.length; hl++){
								if(!gh.ptrActiveLevel.manager.isAgentAlive("name", vConditions[it].hitList[hl])){
									vConditions[it].hitList.splice(hl, 1);
									hl--;
								}
							}
							if(vConditions[it].hitList.length <= 0){
								return true;
							}
							break;
						case "team":
							var agents = gh.ptrActiveLevel.manager.getAllAgents();
							for(var a = 0; (a < agents.length) && (agents[a].team !== vConditions[it].team); a++){}
							if(a >= agents.length){
								return true;
							}
							break;
						default:
							break;
					}
					break;
				default:
					break;
			}
		}

		return false;
	};

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