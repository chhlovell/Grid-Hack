"use strict"

var gh = (function(gh){
	console.log("entryTrigger.js loaded");

	/**
	 * Entry triggers are by default active and only become in-active after the setup game state has
	 * been completed. 
	 * @class EntryTrigger
	 * @param {integer} x
	 * @param {integer} y
	 */
	function EntryTrigger(x, y){
		this.x 		= x;
		this.y		= y;
		this.active	= true;
	}

	/**
	 * @method draw
	 * @param {Canvas.context} context
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 */
	EntryTrigger.prototype.draw = function(context, tileSize, scale, offset){
		if(this.active){
			context.save();

			context.globalAlpha = 0.5;
			context.fillStyle = "blue";
			context.fillRect(
				this.x * tileSize * scale + offset.x, 
				this.y * tileSize * scale + offset.y, 
				tileSize * scale, 
				tileSize * scale);

			context.restore();
		}
	};

	/**
	 * Return true if all heroes have been placed.
	 * Return false if not all heroes in the roster have been placed.
	 * @method onClick
	 * @param {} roster
	 * @param {} map
	 * @return
	 */
	EntryTrigger.prototype.onClick = function(roster, map){

		// counte how many agents in the roster have been placed
		var placed = 0;
		for(var n = 0; n < roster.length; n++){
			if(roster[n].x !== -1 && roster[n].y !== -1){
				placed++;
			}
		}
		if(placed >= roster.length){
			return true;
		}

		// get the first unplaced hero in the player's roster.
		var it = 0;
		while(it < roster.length && roster[it].x !== -1 && roster[it].y !== -1){
			it++;
		}

		roster[it].x = this.x;
		roster[it].y = this.y;

		var cell = map[this.y][this.x];

		if(cell.agents){
			if(cell.agents.length > 0){
				while(cell.agents.length > 0){
					cell.agents[0].x = -1;
					cell.agents[0].y = -1;
					cell.agents.shift();
					placed--;
				}
			}
			cell.agents.push(roster[it]);
			placed++;
		}

		if(placed >= roster.length){
			return true;
		}
		return false;
	};

	gh.EntryTrigger = EntryTrigger;

	return gh;
})(gh || {});