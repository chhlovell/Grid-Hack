"use strict"

var gh = (function(gh){
	console.log("stateSplashScreen.js loaded");
	
	var stateSplashScreen = (function(stateSplashScreen){

		var DSS 			= document.getElementById("diceSplashScreen");
		var DSS_ATK_DICE	= document.getElementById("attackDice");
		var DSS_DEF_DICE 	= document.getElementById("defendDice");

		var _proceed = false;

		stateSplashScreen.setup = function(){
			DSS.onclick = gh.stateSplashScreen.onClick;
		};

		stateSplashScreen.load = function(numHitDice, hits, numDefenceDice, defence, defender	){
			var n = 0;

			_proceed = false;
			
			this.clear();

			// Add the hit dice rolled to the splash screen.
			for(var it = 0; it < numHitDice; it++){
				var c = document.createElement('canvas')
				var ctx = c.getContext("2d");

				c.className 	= "diceBox";
				c.width 		= 100;
				c.height 		= 100;

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

			DSS.style.visibility = "visible";
		};

		stateSplashScreen.clear = function(){
			while(DSS_ATK_DICE.children.length > 0){
				DSS_ATK_DICE.removeChild(DSS_ATK_DICE.children[0]);
			}

			while(DSS_DEF_DICE.children.length > 0){
				DSS_DEF_DICE.removeChild(DSS_DEF_DICE.children[0]);
			}
		};

		stateSplashScreen.update = function(){
			if(_proceed){
				return "stateGame";
			}
			return "stateSplashScreen";
		};

		stateSplashScreen.render = function(){

		};

		stateSplashScreen.onClick = function(){
			if(DSS.style.visibility === "visible"){
				DSS.style.visibility = "hidden";
				//dss.clear();
				_proceed = true;
			} else {
				DSS.style.visibility = "visible";
				_proceed = false;
			}
		}

		return stateSplashScreen;
	})(stateSplashScreen || {});

	gh.stateSplashScreen = stateSplashScreen;
	return gh;
})(gh || {});