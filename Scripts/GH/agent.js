"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){

	console.log("agent.js loaded");

	var state = {};
	state.INACTIVE 		= "inactive";
	state.MOVE 			= "move";
	state.DEAD 			= "dead";
	state.FOCUS 		= "focus";
	state.ACTIVE 		= "active";
	

	/**
	 * @class Agent
	 * @constructor
	 * @param {string} templateID
	 * @param {string} uniqueID
	 * @param {string} description
	 * @param {integer} x
	 * @param {integer} y
	 * @param {} team
	 * @param {integer} body
	 * @param {integer} mind
	 * @param {} baseDefence
	 * @param {} mainHand
	 * @param {} offHand
	 * @param {} chest
	 * @param {} head
	 * @param {} moveDice
	 * @param {integer} baseMove
	 * @param {} spellList
	 * @param {} inventory
	 * @param {} sprites
	 * @param {} animations
	 */
	function Agent(templateID,uniqueID, x, y, owner, team, description, body, mind, baseDefence, mainHand, offHand, chest, head, moveDice, baseMove, spellList, inventory, sprites, animations){
		this.templateID 		= templateID;
		this.uniqueID 			= uniqueID;
		this.x 					= x || -1;
		this.y 					= y || -1;
		this.ptrOwner			= owner || null;
		this.team				= team || "";
		this.description		= description || "";
		this.health 			= {"max" : body || 0, "damage" : 0};
		this.mind 				= {"max" : mind || 0, "damage" : 0};
		this.baseDefence 		= baseDefence || 0;
		this.mainHand 		 	= mainHand || null;
		this.offHand 			= offHand || null;
		this.chest				= chest || null;
		this.head				= head || null;
		this.moveDice			= moveDice || 0;
		this.baseMove			= baseMove || 0;
		this.moved 				= 0;
		this.spellList			= spellList || null;
		this.inventory			= inventory || [];
		loadInventory(this);	// Load the equiped items into the agents inventory.

		this.actionPoints		= 0;
		this.maxActionPoints	= 1;

		this.active 			= false;	// The default state is false.  This should change to active when the agent becomes 'visible' on the board to other players.
		this.protagonist		= false;
		this.state 				= state.INACTIVE;
		this.actionState 		= "inactive";

		this.sprites			= sprites;
		if(animations){
			this.actionStates 	= this.loadActionStates(animations)
		}

		return true;
	}

	/**
	 * This method is used to load an agents initially equiped items into the inventory array.
	 * This method should only be used on creation of a new agent and not called externally.
	 * It is assumed that equiped items do not exist in the agents 'inventory' at the time of its
	 * initialization.
	 * @method loadInventory
	 * @param {gh.Agent} An instnace of a newly created agent.
	 */
	function loadInventory(agent){
		if(agent.mainHand !== null){
			agent.inventory.push(agent.mainHand);
		}
		if(agent.offHand !== null){
			agent.inventory.push(agent.offHand);
		}
		if(agent.chest !== null){
			agent.inventory.push(agent.chest);
		}
		if(agent.head !== null){
			agent.inventory.push(agent.head);
		}

		return;
	}

	/**
	 * @method loadActionStates
	 * @param {} animations
	 */
	Agent.prototype.loadActionStates = function(animations){
		var as = {};

		for(var key in animations){
			as[key] = new gh.Animation(
				animations[key].path,
				animations[key].numFrames,
				animations[key].frameWidth,
				animations[key].repeat,
				animations[key].speed,
				animations[key].index
			);
		}

		return as;
	};

	/**
	 * @method getCurrentHealth
	 */
	Agent.prototype.getCurrentHealth = function(){
		return this.health.max - this.health.damage;
	};

	/**
	 * @method getCurrentMind
	 */
	Agent.prototype.getCurrentMind = function(){
		return this.mind.max - this.mind.damage;
	}

	/**
	 * @method getOpponents
	 * @param {} teamIndex
	 * @param {} allAgents
	 */
	Agent.prototype.getOpponents = function(teamIndex, allAgents){
		var hostile = teamIndex[this.team].hostile;
		var opponents = [];

		for(var it = 0; it < allAgents.length; it++){
			if(allAgents[it].isHostile(this, teamIndex)){
				opponents.push(allAgents[it]);
			}
		}

		return opponents;
	};

	/**
	 * @method getClosestPathTo
	 * @param {} target
	 * @return
	 */
	Agent.prototype.getClosestMovePathTo = function(map, target){
		var cellSet = [];

		if(this.canMove("up", map)){
			cellSet.push({"cell" : map[this.y-1][this.x], "direction" : "up"});
		}
		if(this.canMove("down", map)){
			cellSet.push({"cell" : map[this.y+1][this.x], "direction" : "down"});
		}
		if(this.canMove("left", map)){
			cellSet.push({"cell" : map[this.y][this.x-1], "direction" : "left"});
		}
		if(this.canMove("right", map)){
			cellSet.push({"cell" : map[this.y][this.x+1], "direction" : "right"});
		}

		return cellSet;
	};

	/**
	 * @method getClosestOpponent
	 * @param {} teamIndex
	 * @param {gh.Agent[]} allAgents
	 * @return 
	 */
	Agent.prototype.getClosestOpponent = function(teamIndex, allAgents){
		var opponent;
		var hostileAgents = this.getOpponents(teamIndex, allAgents);

		if(hostileAgents.length > 0){
			opponent = hostileAgents[0];
			for(var it = 0; it < hostileAgents.length; it++){
				if(gh.getMapDist(this.x, this.y, hostileAgents[it].x, hostileAgents[it].y) < gh.getMapDist(this.x, this.y, opponent.x, opponent.y)){
					opponent = hostileAgents[it];
				}
			}
		} else {
			opponent = null;
		}

		return opponent;
	};

	Agent.prototype.startTurn = function(){
		this.state = "active";

		this.moved = this.baseMove;
		for(var it = 0; it < this.moveDice; it++){
			this.moved += new gh.Dice(6).roll();
		}

		this.actionPoints = 0;
	};

	/**
	 * @method canMove
	 * @param {string} direction
	 * @param {} map
	 * @param {} from
	 * @return
	 */
	Agent.prototype.canMove = function(direction, map, from){
		if(!from){
			from = {};
			from.x = this.x;
			from.y = this.y;
		}

		if(this.moved <= 0){
			return false;
		}

		// Is a border blocking the movement direction?

		var d = direction;
		if(d === "up"){ d = "top"; }
		if(d === "down"){ d = "bottom"; }

		var cell = map[from.y][from.x];
		if(cell.border){
			if(cell.border[d]){
				var border = cell.border[d];
				if(border instanceof gh.Wall){
					if(!border.passable){
						return false;
					}
				}
				if(border instanceof gh.Door){
					if(!border.open){
						return false;
					}
				}

			}
		}

		// Is there an obstructing agent or object in the direction of movement
		var destination;
		switch(direction){
			case "left":
				destination = map[from.y][from.x-1];
				break;
			case "right":
				destination = map[from.y][from.x+1];
				break;
			case "up":
				destination = map[from.y-1][from.x];
				break;
			case "down":
				destination = map[from.y+1][from.x];
				break;
			default:
				break;
		}

		// Is there an obstructing hostile agent?
		// Only check the top-most (last) agent in the agent queue for the destination cell.
		if(destination.agents && destination.agents.length > 0	){
			if(this.isHostile(destination.agents[destination.agents.length-1],	gh.ptrActiveLevel.teams)){
				return false;
			}
		}

		return true;
	}

	/**
	 * @method move
	 * @param {string} direction This can be 'up' 'down' 'left' and 'right'.
	 * @param {gh.Cell[][]} map A 2d array of cells.
	 */
	Agent.prototype.move = function(direction, map){
		if(this.moved <= 0){
			return false;
		}

		if(!this.canMove(direction, map)){
			return false;
		}

		// The move is valid at this juncture.
		// Remove the reference to the agent from the cell it currently resides in.
		var cell = map[this.y][this.x];
		var agents = cell.agents;
		for(var it = 0; it < agents.length && agents[it] !== this; it++){
		}
		agents.splice(it, 1);

		// Update the agents x/y location.
		switch(direction){
			case "left":
				this.x--;
				break;
			case "right":
				this.x++;
				break;
			case "up":
				this.y--;
				break;
			case "down":
				this.y++;
				break;
			default:
				break;
		}

		// Reduce the number of moves the agent has left.
		this.moved--;
		console.log(this.moved);

		// Add the agent to the destination cell.
		map[this.y][this.x].agents.push(this);

		// Update the maps visibility.
		gh.ptrActiveLevel.mapData.map.updateAgentVisibility(this);

		return true;
	};

	/**
	 * @method draw
	 * @param {} assets
	 * @param {Canvas.context}
	 * @param {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 */
	Agent.prototype.draw = function(assets, context, tileSize, scale, offset){
		this.actionStates[this.state].draw(
			assets, 
			context,
			this.x * tileSize * scale + offset.x,
			this.y * tileSize * scale + offset.y,
			tileSize * scale,
			tileSize * scale
		);
	}

	/**
	 * @method isClicked
	 * @param {integer} x
	 * @param {integer} y
	 * @param {float} tileSize
	 * @param {} sprites
	 * @return
	 */
	Agent.prototype.isClicked = function(x, y, tileSize, sprites){
		var pixel = this.actionStates[this.state].getPixelAt(x, y, tileSize, sprites);

		return !pixel.isTransparent();
	};

	/**
	 * Determines whether or not the target is hostile to the agent
	 * @method isHostile
	 * @param {gh.Agent} target
	 * @param {} teams
	 */
	Agent.prototype.isHostile = function(target, teams){
		var faction = teams[this.team].hostile;
		for(var it = 0; it < faction.length; it++){
			if(faction[it] === target.team){
				return true;
			}
		}

		return false;
	};

	/**
	 * @method getDefenceDice
	 * @return
	 */
	Agent.prototype.getDefenceDice = function(){
		var defenceDice = 0;
		
		if(this.chest !== null){

		}
		if(this.head !== null){

		}
		if(this.offHand !== null){

		}

		if(defenceDice === 0){
			defenceDice = this.baseDefence;
		}

		return defenceDice;
	}

	/**
	 * A human agent successfully defends on a 1 or 2.
	 * A computer agent successfully defends on a 1.
	 * @method getDefence
	 */
	Agent.prototype.getDefence = function(){
		var defence 		= {"sum" : 0, "dice" : []};
		var defenceDice 	= this.getDefenceDice();

		console.log(this);

		for(var it = 0; it < defenceDice; it++){
			var r = gh.hqDice.roll();
			switch(this.ptrOwner.AI){
				case false:
					if(r === "whiteShield"){
						defence.sum++;
					}
					break;
				case true:
					console.log("AI");
					if(r === "blackShield"){
						defence.sum++;
					}
					break;
				default:
					break;
			}
			defence.dice.push(r);
		}
		return defence;
	};

	/**
	 * @method canAttack
	 * @param {Agent} target
	 * @return
	 */
	Agent.prototype.canAttack = function(target){
		if(this.actionPoints >= 1) return false;
		if(!this.isHostile(target, gh.ptrActiveLevel.teams)) return false;
		if(this.mainHand.diagonal){
			if(gh.isDiagonal(this.x, this.y, target.x, target.y)){
				return true;
			}
		}
		if(gh.getMapDist(this.x, this.y, target.x, target.y) > this.mainHand.range) return false;

		return true;
	};

	/**
	 * @method attack
	 * @param {gh.Agent} target
	 * @return
	 */
	Agent.prototype.attack = function(target){
		if(!this.canAttack(target)){
			return null;
		}

		this.actionPoints++;

		var hits = this.mainHand.attack();
		var defence = target.getDefence();

		// Ensure that the damage value is positve and prevents negative values.
		var dmg = hits.sum - defence.sum;
		if(dmg < 0){
			dmg = 0;
		}
		return {"damage" : dmg, "hits" : hits, "defence" : defence};
	};

	/**
	 * @method damageHealth
	 * @param {integer} damage
	 * @return
	 */
	Agent.prototype.damageHealth = function(damage){
		this.health.damage += damage;
		if(this.health.damage >= this.health.max){
			this.state = state.DEAD;
			this.ptrOwner.removeAgent(this);
			return "dead";
		} else {
			return "alive";
		}
	};

	gh.Agent = Agent;

	return gh;
})(gh || {});