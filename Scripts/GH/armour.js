/** 
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("armour.js loaded");

	function Armour(name, defence, cost){
		this.name = name;
		this.defence = defence;
		this.cost = cost || 0;
	}

	gh.Armour = Armour;

	return gh;
})(gh || {});