"use strict"
/** 
 * @ module gh
 */


/**
 * @class gh
 */
var gh = (function(gh){
	console.log("cell.js loaded");
	/**
	 * Description
	 * border {
	 * 	top: {
	 * 			"passable" : true/false,
	 *			"transparent" : true/false,
	 *			"door" : true/false,
	 *			"open" : true/false,
	 * 			"locked" : true/false,
	 *			"imageStates" : {
	 *			}
	 *		 }
	 *	left: {}
	 * }
	 * @class Cell
	 * @constructor
	 * @param {integer} x The location of the cell on the x axis.
	 * @param {integer} y The location of the cell on the y axis.
	 * @param {} border
	 * @param {[Agent]} agents A list of agents occupying the cell.
	 * @param {[Item]} items A list of items on the cell.
	 * @param {[Trigger]} triggers A list of triggers on the cell.
	 * @param {graphics.Sprite} ptrSprite The name of the floor sprite which should be drawn.
	 * @return
	 */
	function Cell(x, y, border, agents, items, triggers, visible, spriteId){
		this.x 			= x || null;
		this.y 			= y || null;
		this.border 	= border || {};
		this.agents 	= agents || [];
		this.items 		= items || [];
		this.triggers	= triggers || [];
		this.visible 	= visible || {};
		this.spriteId	= spriteId || null;

		this.focus 		= false; // Is the mouse over the cell.

		return true;
	}

	/**
	 * @method drawFloor
	 * @param {Canvas.context} context
	 * @param {integer} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {string} team
	 * @return
	 */
	Cell.prototype.drawFloor = function(context, tileSize, scale, offset, team){

		if(this.visible && this.visible[team] === true){
			context.save();
	
			if(this.spriteId){
				gh.assets.sprites[this.spriteId].draw(
					context, 
					this.x * tileSize * scale + offset.x,
					this.y * tileSize * scale + offset.y,
					tileSize * scale,
					tileSize * scale
				);
			}

			context.restore();
		}

		return true;
	};

	/**
	 * @method drawBorder
	 * @param {Canvas.context} context
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {string} team
	 */
	Cell.prototype.drawBorders = function(context, tileSize, scale, offset, team){
		if(this.border){

			if(this.visible && this.visible[team] === true){
				context.save();

				for(var key in this.border){
					this.border[key].draw(context, tileSize, scale, offset);
				}

				context.restore();
			}
		}

		return true;
	};

	/**
	 * @method drawAgents
	 */
	Cell.prototype.drawAgents = function(context, tileSize, scale, offset, team){
		if(this.agents === undefined) return;
		if(this.agents.length <= 0) return;

		if(this.visible && this.visible[team] === true){
				context.save();

				// Only draw the last agent in the list
				this.agents[this.agents.length-1].draw(
					gh.assets.sprites, 
					context, 
					tileSize, 
					scale, 
					offset
				);

				context.restore();
		}
	};

	/**
	 * @method setMouseFocus
	 * @param {integer} mouseX
	 * @param {integer} mouseY
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {} sprites
	 * @return
	 */
	Cell.prototype.setMouseFocus = function(mouseX, mouseY, tileSize, scale, offset, sprites){
		var relx = (mouseX - offset.x) - (this.x * tileSize * scale);
		var rely = (mouseY - offset.y) - (this.y * tileSize * scale);

		relx = relx / scale;
		rely = rely / scale;

		if(this.agents){
			var agent = this.agents[this.agents.length -1];
		}


		if(this.border){
			for(var key in this.border){
				if(this.border[key].isMouseOver(relx, rely, key, tileSize, sprites)){
					this.border[key].focus = true;
					return;
				} else {
					this.border[key].focus = false;
				}
			} 
		}

		return null;
	}

	/**
	 * @method removeAgent
	 * @param {gh.Agent} agent
	 */
	Cell.prototype.removeAgent = function(agent){
		for(var it = 0; it < this.agents.length && this.agents[it] !== agent; it++){

		}
		if(it < this.agents.length){
			this.agents.splice(it, 1);
			console.log(this.agents);
		}
	};

	/**
	 * @method onClick
	 */
	Cell.prototype.onClick = function(mouseX, mouseY, tileSize, scale, offset, sprites, activeAgent){

		var obj = this.getClicked(mouseX, mouseY, tileSize, scale, offset, sprites);

		if(obj !== activeAgent){
			switch(activeAgent.actionState){
				case "attack":
					if(obj instanceof gh.Agent){
						if(activeAgent.isHostile(obj, gh.ptrActiveLevel.teams)){
							var attack = activeAgent.attack(obj);

							gh.hud.displayAttack(activeAgent.mainHand.attackDice, attack.hits, obj.getDefenceDice(), attack.defence);

							if(obj.damageHealth(attack.damage) === "dead"){
								this.removeAgent(obj);
							}
						} else {
							console.log("invalid target");
						}
					}
					break;
				case "search":
					break;
				case "item":
					break;
				case "traps":
					break;
				case "spell":
					break;
				default:
					break;
			};
		}


		if(obj instanceof gh.Door){
			if(gh.getMapDist(activeAgent.x, activeAgent.y, this.x, this.y) <= 1){
				if(obj.open === false){
					obj.open = true;
				} else {
					obj.open = false;
				}

				if(obj.open === true){
					//update the map visibility for the currently active agent
					gh.ptrActiveLevel.mapData.map.updateAgentVisibility(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent());
				}
			}
		}

		if(obj instanceof gh.Wall){
			console.log("wall click");
		}
	}

	/**
	 * @method getClicked
	 * @param {integer} mouseX
	 * @param {integer} mouseY
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {} sprites
	 * @return
	 */
	Cell.prototype.getClicked = function(mouseX, mouseY, tileSize, scale, offset, sprites){
		// 1st get the relative position of the mouse coordinates with respect to the cell
		// Account for the image scale
		var relx = (mouseX - offset.x) - (this.x * tileSize * scale);
		var rely = (mouseY - offset.y) - (this.y * tileSize * scale);

		relx = relx / scale;
		rely = rely / scale;

		if(this.triggers && this.triggers.length > 0){
			for(var it = 0; it < this.triggers.length; it++){
				if(this.triggers[it] instanceof gh.EntryTrigger && this.triggers[it].active === true){
					return this.triggers[it];
				}				
			}
		}

		if(this.agents && this.agents.length > 0){
			var agent = this.agents[this.agents.length-1];
			if(agent.isClicked(relx, rely, tileSize, sprites)){
				return agent;
			}
		}

		if(this.border){
			for(var key in this.border){
				if(this.border[key].isClicked(relx, rely, key, tileSize, sprites)){
					return this.border[key];
				}
			}
		}

		return null;
	};

	gh.Cell = Cell;
	return gh;
})(gh || {});