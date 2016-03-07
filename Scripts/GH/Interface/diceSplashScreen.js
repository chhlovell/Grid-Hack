/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("diceSplashScreen.js loaded");

	/**
	 * @class dss
	 */
	var dss = (function(dss){

		/**
		 * Private globals
		 */
		var DSS 			= document.getElementById("diceSplashScreen");
		var DSS_ATK_DICE	= document.getElementById("attackDice");
		var DSS_DEF_DICE 	= document.getElementById("defendDice");


		/**
		 * @method setVisible
		 * @param {bool} visible
		 */
		dss.setVisible = function(visible){
			if(visible){
				DSS.style.visibility = "visible";
			} else {
				DSS.style.visibility = "hidden";
			}
		};

		/**
		 * @method update
		 * @param {} numHitDice
		 * @param {} hits
		 * @param {} numDefenceDice
		 * @param {} defence
		 */
		dss.update = function( numHitDice, hits, numDefenceDice, defence){
			console.log(arguments);
		};

		return dss;
	})(dss || {});

	gh.dss = dss;
	
	return gh;
})(gh || {});