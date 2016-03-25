/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("diceSplashScreen.js loaded");

	/**
	 * @class HQDice
	 * @constructor
	 */
	function HQDice(spriteStrip){
		this.spriteStrip 	= spriteStrip;
		this.sides			= ["blackShield", "whiteShield", "whiteShield", "skull", "skull", "skull"];
	}

	/**
	 * @method draw
	 * @param {string || integer} frame
	 * @param {Canvas.context} context
	 * @param {integer} x
	 * @param {integer} y
	 */
	HQDice.prototype.draw = function(frame, context, x, y){
		this.spriteStrip.draw(frame, context, x, y, this.spriteStrip.frameWidth, this.spriteStrip.img.height);
	};

	HQDice.prototype.roll = function(){
		var r = Math.floor((Math.random() * 6));
		return this.sides[r];
	};

	gh.hqDice = new HQDice(new graphics.SpriteStrip("./Data/Graphics/hqdice.gif", 6, 100, {"skull" : 3, "whiteShield" : 1, "blackShield" : 0}));

	/**
	 * @class dss
	 * @constructor
	 */
	var dss = (function(dss){

		/**
		 * Private globals
		 */
		var DSS 			= document.getElementById("diceSplashScreen");
		var DSS_ATK_DICE	= document.getElementById("attackDice");
		var DSS_DEF_DICE 	= document.getElementById("defendDice");

		// class "diceBox" 

		/**
		 * Public methods
		 */

		/**
		 * @method setupInput
		 */
		dss.setupInput = function(){
			DSS.onclick = dss.onClick;
		};

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
		 * Change the visibility of the dice splash screen.
		 * On the assumption that it is only visible following an attack, also clear the existing
		 * dice canvas elements from the display.
		 * @method onClick
		 */
		dss.onClick = function(){
			if(DSS.style.visibility === "visible"){
				DSS.style.visibility = "hidden";
				dss.clear();
			} else {
				DSS.style.visibility = "visible";
			}
		};

		/**
		 * Add the dice rolled for attack and defence to the screen as canvas elements for
		 * display. Randomly generate what images should appear for 'misses'.
		 * @method update
		 * @param {} numHitDice
		 * @param {} hits
		 * @param {} numDefenceDice
		 * @param {} defence
		 */
		dss.update = function(numHitDice, hits, numDefenceDice, defence, defender){
			var n = 0;

			// Add the hit dice rolled to the splash screen.
			for(var it = 0; it < numHitDice; it++){
				var c = document.createElement('canvas')
				var ctx = c.getContext("2d");

				c.className = "diceBox";
				c.width = 100;
				c.height = 100;

				if(defender.ptrOwner.AI){
					ctx.fillStyle = "white";
				} else {
					ctx.fillStyle = "red";
				}
				ctx.fillRect(0, 0, c.width, c.height);

				switch (hits.dice[it]){
					case "skull":
						gh.hqDice.draw("skull", ctx, 0, 0);
						break;
					case "whiteShield":
						gh.hqDice.draw("whiteShield", ctx, 0, 0);
						break;
					case "blackShield":
						gh.hqDice.draw("blackShield", ctx, 0, 0);
						break;
					default:
						break;
				}

				DSS_ATK_DICE.appendChild(c);
			}

			// Add the defence dice to the splash screen.
			var d = 0;

			for(var it = 0; it < numDefenceDice; it++){
				var c = document.createElement('canvas');
				var ctx = c.getContext("2d");

				c.className = "diceBox";
				c.width = 100;
				c.height = 100;

				if(defender.ptrOwner.AI){
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "white";
				}
				ctx.fillRect(0, 0, c.width, c.height);

				switch (defence.dice[it]){
					case "skull":
						gh.hqDice.draw("skull", ctx, 0, 0);
						break;
					case "whiteShield":
						gh.hqDice.draw("whiteShield", ctx, 0, 0);
						break;
					case "blackShield":
						gh.hqDice.draw("blackShield", ctx, 0, 0);
						break;
					default:
						break;
				}

				DSS_DEF_DICE.appendChild(c);
			}
		};

		/**
		 * Remove the dice 'canvas' elements from the display.
		 * @method clear
		 */
		dss.clear = function(){
			while(DSS_ATK_DICE.children.length > 0){
				DSS_ATK_DICE.removeChild(DSS_ATK_DICE.children[0]);
			}

			while(DSS_DEF_DICE.children.length > 0){
				DSS_DEF_DICE.removeChild(DSS_DEF_DICE.children[0]);
			}
		};

		return dss;
	})(dss || {});

	gh.dss = dss;
	
	return gh;
})(gh || {});