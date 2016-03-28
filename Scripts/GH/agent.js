"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){

	console.log("agent.js loaded");

	// The state object is used to identify which animation state an agent is in.
	// It is utilized by this.actionStates when drawing the agent to the game board.
	var state = {};
	state.INACTIVE 		= "inactive";
	state.MOVE 			= "move";
	state.DEAD 			= "dead";
	state.FOCUS 		= "focus";
	state.ACTIVE 		= "active";

	var _uid			= 0;

	function getUID(){
		var uid = "Agent" + _uid;
		_uid++;

		return uid;
	}
	
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
	function Agent(name, resRef, uniqueID, x, y, owner, team, description, body, mind, baseDefence, mainHand, offHand, chest, head, moveDice, baseMove, spellDomains, inventory, sprites, animations){
		this.name 				= name;
		this.resRef 			= resRef;
		this.uniqueID 			= uniqueID || getUID();
		this.x 					= x;
		this.y 					= y;
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
		this.spellDomains		= spellDomains || null;
		this.inventory			= inventory || [];
		loadInventory(this);	// Load the equiped items into the agents inventory.

		this.actions 			= {
			"max"		: 1,
			"attack"	: 0,
			"search"	: 0,
			"traps"		: 0,
			"reset"		: function(){
				this.attack = 0;
				this.search = 0;
				this.traps = 0;
			},
			"get"		: function(){
				return this.attack + this.search + this.traps;
			},
			"used"		: function(){
				if(this.get() >= this.max){
					return true;
				} 
				return false;
			}
		}

		this.active 			= false;	// The default state is false.  This should change to active when the agent becomes 'visible' on the board to other players.
		this.protagonist		= false;

		// Agent.actionState
		// action states can be:
		//		"default" 		-> the neutral action state for an agent.
		//		"searchItem" 	-> search an item state
		//		"searchTraps" 	-> search for traps state
		this.actionState 		= "default";

		// Agent.state

		this.sprites			= sprites; 	// Contains static image references for user interface 
											//elements such as the gh.hud

		this.state 				= state.INACTIVE; // This identifies which animation state the agent is in.
		if(animations){	
			this.actionStates 	= this.loadActionStates(animations) // actionStates contains the graphic
																	// data - gh.Animation - for use on the
																	// canvas board.
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
		if(agent.offHand !== undefined && agent.mainHand !== null && agent.mainHand !== ""){
			agent.inventory.push(agent.mainHand);
		}
		if(agent.offHand !== undefined && agent.offHand !== null && agent.offHand !== ""){
			agent.inventory.push(agent.offHand);
		}
		if(agent.offHand !== undefined && agent.chest !== null && agent.chest !== ""){
			agent.inventory.push(agent.chest);
		}
		if(agent.offHand !== undefined && agent.head !== null && agent.head !== ""){
			agent.inventory.push(agent.head);
		}

		return;
	}

	Agent.prototype.addToInventory= function(item){
		if(item instanceof gh.Gold){
			console.log("add gold");
			this.inventory.push(item);
			return;
		}

		if(item instanceof gh.Gem){
			console.log("add gem");
			this.inventory.push(item);
			return;
		}

		if(item instanceof gh.Jewel){
			console.log("add jewel");
			this.inventory.push(item);
			return;
		}

		if(item instanceof gh.Potion){
			console.log("add potion");
			this.inventory.push(item);
			return;
		}

	};

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
	 * This method returns true if an item is equiped by the agent. A specific location can also be given as a parameter to expediate the search.
	 * @method isEquiped
	 * @param {} item
	 * @param {} location
	 * @return
	 */
	Agent.prototype.isEquiped = function(item, location){
		if(location){
			// Check the specified location
			if(this[location] === item){
				return true;
			}
		} else {
			// Check every body location
			if(this.head === item){
				return true;
			}

			if(this.chest === item){
				return true;
			}

			if(this.mainHand === item){
				return true;
			}

			if(this.offHand === item){
				return true;
			}
		}

		return false;
	};

	/**
	 * @method unequip
	 * @parma {} item
	 * @param {string} location
	 */
	Agent.prototype.unequip = function(item, location){
		if(location){
			// Check the specified location
			if(this[location] === item){
				this[location] = null;
			}
		} else {
			// Check every body location
			if(this.head === item){
				this.head = null;
			}

			if(this.chest === item){
				this.chest = null;
			}

			if(this.mainHand === item){
				this.mainHand = null;
			}

			if(this.offHand === item){
				this.offHand = null;
			}
		}
	}

	/**
	 * @method equip
	 * @parma {} item
	 * @param {string} location
	 */
	Agent.prototype.equip = function(item, location){
		if(item instanceof gh.Weapon){
			if(this.mainHand !== null){
				this.unequip(this.mainHand, "mainHand");
			}
			if(item.hands === 2 && this.offHand !== null){
				this.unequip(this.offHand, "offHand");
			}

			this.mainHand = item;
		}

		if(item instanceof gh.Armour){
			console.log(item);
			if(this[item.slot] !== null){
				this.unequip(this[item.slot], item.slot);
			}
			this[item.slot] = item;
		}
	};

	/**
	 * Find an item in the agents inventory given a uniqueID reference for the item. 
	 * @method findItem
	 * @parma {string} uid The uniqueID of the item being looked for.
	 */
	Agent.prototype.findItem = function(uid){
		for(var it = 0; it < this.inventory.length && this.inventory[it].uniqueID !== uid; it++){

		}

		var item = this.inventory[it];

		// If the item is not found in the inventory check the natural armour (baseDefence).
		if(!item){
			if(this.baseDefence.uniqueID === uid){
				item = this.baseDefence;
			}
		}

		return item;
	};


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

		this.actions.reset();
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

		// Is there an obstructive object?
		if(destination.items && destination.items.length > 0){
			for(var it = 0; it < destination.items.length; it++){
				console.log(destination.items[it]);
				if(destination.items[it].obstacle){
					return false;
				}
			}
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
	};

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
			defenceDice += this.chest.defence;
		}
		if(this.head !== null){
			defenceDice += this.head.defence;
		}
		if(this.offHand !== null && this.offHand instanceof gh.Armour){
			defenceDice += this.offHand.defence;
		}

		defenceDice += this.baseDefence.defence;

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

		for(var it = 0; it < defenceDice; it++){
			var r = gh.hqDice.roll();
			switch(this.ptrOwner.AI){
				case gh.AI.HUMAN:
					if(r === "whiteShield"){
						defence.sum++;
					}
					break;
				case gh.AI.COMPUTER:
					if(r === "blackShield"){
						defence.sum++;
					}
					break;
				default:
					console.log("default AI");
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
		if(this.actions.used()) return false;
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
	 * @method getAttackDice
	 */
	Agent.prototype.getAttackDice = function(){
		if(this.mainHand){
			return this.mainHand.attackDice;
		} else {
			return 0;
		}
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

		this.actions.attack++;

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