"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("player.js loaded");

	gh.AI = {};
	gh.AI.HUMAN 	= 0;
	gh.AI.COMPUTER 	= 1;

	/**
	 * @class Player
	 * @constructor
	 * @param {string} name
	 * @param {bool} AI
	 * @param {[Agent]}
	 */
	function Player(name, AI, roster){
		this.name = name;
		this.AI = AI;
		this.roster = roster || [];

		// Update the roster such that the agents have knowlege of their 'owning' player
		for(var it = 0; it < this.roster.length; it++){
			this.roster[it].ptrOwner = this;
		}

		this.ptrActiveAgent = 0;
	}

	/**
	 * This method sets the players currently active agent to the next agent in the roster.
	 * If the last agent in the roster has completed its turn, return false.
	 * If the last agent in the roster has not completed its turn return true.
	 * @method setNextTurn
	 * @return
	 */
	Player.prototype.setNextTurn = function(){
		this.ptrActiveAgent++;
		if(this.ptrActiveAgent >= this.roster.length){
			this.ptrActiveAgent = 0;
			return false;
		}

		return true;
	};

	/** 
	 * @method getActiveAgent
	 * @return
	 */
	Player.prototype.getActiveAgent = function(){
		if(this.roster.length > 0){
			return this.roster[this.ptrActiveAgent];
		}

		return null;
	};

	Player.prototype.removeAgent = function(agent){
		for(var it = 0; it < this.roster.length && this.roster[it] !== agent; it++){
		}
		if(it < this.roster.length){
			this.roster.splice(it, 1);
		}
	};

	/**
	 * @method update
	 * @return
	 */
	Player.prototype.update = function(){

	};

	gh.Player = Player;
	return gh;
})(gh || {});