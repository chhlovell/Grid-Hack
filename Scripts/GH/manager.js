"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("manager.js loaded");

	/**
	 * @class Mlayer
	 * @constructor
	 * @param {[Player]} players
	 */
	function Manager(players){
		this.players = players || [];
		this.activePlayer = 0;
	}

	/**
	 * @method addPlayer
	 * @param {Player} player
	 */
	Manager.prototype.addPlayer = function(player){
		this.players.push(player);
	};

	/**
	 * @method getActivePlayer
	 * @return
	 */
	Manager.prototype.getActivePlayer = function(){
		if(this.players.length > 0){
			return this.players[this.activePlayer];
		}

		return null;
	};

	/**
	 * @method setNextTurn
	 * @return
	 */
	Manager.prototype.setNextTurn = function(){
		if(this.players[this.activePlayer].setNextTurn() === false){
			this.activePlayer++;
			if(this.activePlayer >= this.players.length){
				this.activePlayer = 0;
			}
		}

		return true;
	};

	/** 
	 * @method getAgentsAd
	 * @param {integer} x
	 * @param {integer} y
	 * @return
	 */
	Manager.prototype.getAgentsAt = function(x, y){
		var agents = [];

		for(var it = 0; it < this.players.length; it++){
			for(var n = 0; n < this.players[it].roster.length; n++){
				if(this.players[it].roster[n].x === x && this.players[it].roster[n].y === y){
					agents.push(this.players[it].roster[n]);
				}
			}
		}

		return agents;
	};

	Manager.prototype.getAllAgents = function(){
		var agents = [];

		for(var it = 0; it < this.players.length; it++){
			agents = agents.concat(this.players[it].roster);
		}

		return agents;
	};

	/**
	 * @method isAgentAlive
	 * @param {string} idKey This can be a value of "name", "resRef", or "uniqueID" and is used to determine if an agent is allive.
	 * @param {string} arg This is a string value that corresponds with the idKey compared with.
	 * @return
	 */
	Manager.prototype.isAgentAlive = function(idKey, arg){
		var agents = this.getAllAgents();

		for(var it = 0; it < agents.length && agents[it][idKey] !== arg; it++){

		}

		if(it < agents.length){
			return true;
		}

		return false;
	};

	Manager.prototype.endTurn = function(){
		this.getActivePlayer().getActiveAgent().state = "inactive";
		this.setNextTurn();
		if(this.getActivePlayer().getActiveAgent()){
			this.getActivePlayer().getActiveAgent().startTurn();
		}
	};

	gh.Manager = Manager;
	return gh;
})(gh || {});