/** 
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("armour.js loaded");

	/**
	 * PRIVATE GLOBALS
	 */

	var UID = 0;


	/**
	 * PRIVATE FUNCTIONS
	 */

	/**
	 * @function getUniqueID
	 */
	function getUniqueID(){
		var uid = "armour" + UID;
		UID++;
		return uid;
	}

	/**
	 * PUBLIC FUNCTIONS
	 */

	/**
	 * @class Armour
	 * @param {string} name
	 * @param {integer} defence
	 * @param {integer} cost
	 * @param {string} slot
	 */
	function Armour(name, defence, cost, slot){
		this.name 		= name;
		this.uniqueID 	= getUniqueID();
		this.defence 	= defence;
		this.cost 		= cost || 0;
		this.slot 		= slot;
	}

	gh.Armour = Armour;

	return gh;
})(gh || {});