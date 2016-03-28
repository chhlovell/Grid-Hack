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
	 * @param {float} rotation The degrees to which the image of the cell should be 
	 * rotated when drawn. For the purposes of use within a grid system this should be
	 * limited to a factor of 90 degrees.
	 * @return
	 */
	function Cell(x, y, border, agents, items, triggers, visible, spriteId, rotation){
		this.x 			= x || null;
		this.y 			= y || null;
		this.border 	= border || {};
		this.agents 	= agents || [];
		this.items 		= items || [];
		this.effects	= [];
		this.triggers	= triggers || [];
		this.visible 	= visible || {};
		this.spriteId	= spriteId || null;
		this.rotation	= rotation || 0;

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
					tileSize * scale,
					this.rotation
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
	 * @method drawItems
	 * @param {} context
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {} team
	 */
	Cell.prototype.drawItems = function(context, tileSize, scale, offset, team){
		if(!this.items || (this.items.length === 0)){
			return;
		}

		if(this.visible && this.visible[team] === true){
			context.save();

			this.items[this.items.length-1].draw(context, tileSize, scale, offset, team);

			context.restore();
		}

		return true;
	}

	/**
	 * @method drawEffects
	 * @param {} context
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {} team
	 */
	Cell.prototype.drawEffects = function(context, tileSize, scale, offset, team){
		if(!this.effects || this.effects.length === 0){
			return;
		}

		if(this.visible && this.visible[team] === true){
			context.save();

			this.effects[this.effects.length-1].draw(context, this.x * tileSize * scale + offset.x, this.y * tileSize * scale + offset.y, tileSize * scale, tileSize * scale, 0);

			context.restore();
		}
	}

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
		var focus = null;

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
					return this.border[key];
				} else {
					this.border[key].focus = false;
				}
			} 
		}

		return focus;
	}

	/**
	 * @method removeAgent
	 * @param {gh.Agent} agent
	 */
	Cell.prototype.removeAgent = function(agent){
		// Find the location of the agent in the cell's agent list.
		for(var it = 0; it < this.agents.length && this.agents[it] !== agent; it++){

		}

		// Remove the agent from the list.
		if(it < this.agents.length){
			this.agents.splice(it, 1);
		}
	};

	/**
	 * @method onClick
	 */
	Cell.prototype.onClick = function(mouseX, mouseY, tileSize, scale, offset, sprites, activeAgent){

		var obj = this.getClicked(mouseX, mouseY, tileSize, scale, offset, sprites);

		if(obj !== activeAgent && obj instanceof gh.Agent){
			// The selected object is a hostile agent.
			// Investigate the possiblity of attacking the agent.
			if(activeAgent.isHostile(obj, gh.ptrActiveLevel.teams)){
				var w = activeAgent.mainHand;
				if(activeAgent.canAttack(obj)){
					var attack = activeAgent.attack(obj);

					if(attack !== null){
						// If the target agent has been killed remove it from the game (board and its owner's roster)
						// and add a corpse/blood splatter effect to the board.
						if(obj.damageHealth(attack.damage) === "dead"){
							this.effects.push(gh.assets.sprites["blood-splatter.gif"]);
							this.removeAgent(obj);
						}

						gh.stateSplashScreen.load(activeAgent.mainHand.attackDice, attack.hits, obj.getDefenceDice(), attack.defence, obj);
						return "stateSplashScreen";
					}
				}
			}
			return "stateGame";
		}

		if(obj instanceof gh.Item){
			if(obj.onSearch(activeAgent)){
				return "stateTreasure";
			} else {
				return "stateGame";
			}
			/*
			activeAgent.actions.search++;
			var treasure = gh.ptrActiveLevel.treasure.getCard();
			gh.stateTreasure.load(treasure);
			return "stateTreasure";
			*/
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
			return "stateGame";
		}

		if(obj instanceof gh.Wall){
			console.log("wall click");

			return "stateGame";
		}

		return "stateGame";
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
		var relx = (mouseX - offset.x) - (this.x * tileSize * scale);
		var rely = (mouseY - offset.y) - (this.y * tileSize * scale);

		// Account for the image scale
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

		if(this.items && this.items.length > 0){
			var item = this.items[this.items.length -1];
			if(item.isClicked(this.x, this.y, mouseX, mouseY, tileSize, scale, offset, sprites)){
				return item;
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