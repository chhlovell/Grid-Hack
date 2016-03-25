"use strict"

/**
 * @module gh
 */


/**
 * @class gh
 */
var gh = (function(gh){
	console.log("weapon.js loaded");

	/**
	 * @class Weapon
	 * @constructor
	 * @param {string} name
	 * @param {string} resRef
	 * @apram {string} size
	 * @param {integer} attack
	 * @param {integer} hands
	 * @param {integer} range
	 * @param {bool} diagonal
	 * @param {integer} cost
	 */
	function Weapon(name, resRef, size, attack, hands, range, diagonal, cost, actionPoints){
		this.name 			= name;
		this.resRef 		= resRef;
		this.size			= size;
		this.attackDice		= attack;
		this.hands			= hands;
		this.range			= range;
		this.diagonal		= diagonal || false;
		this.cost			= cost || 0;
		this.actionPoints   = actionPoints || 1;
	}

	/**
	 * Returns the number of successful hits when attacking with this weapon.
	 * A 4+ on a d6 is a hit.
	 * @method attack
	 * @return
	 */
	Weapon.prototype.attack = function(){
		var attack = {"sum" : 0, "dice" : []};
		
		for(var it = 0; it < this.attackDice; it++){
			var roll = gh.hqDice.roll();
			if(roll === "skull"){
				attack.sum++;
			}
			attack.dice.push(roll);
		}

		return attack;
	};

	gh.Weapon = Weapon;

	return gh;
})(gh || {});