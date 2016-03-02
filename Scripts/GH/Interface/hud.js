"use strict"

var gh = (function(gh){
	console.log("hud.js loaded");

	var hud = (function(hud){

		/**
		 * Private constants
		 */
		var DICE1 = "d1";
		var DICE2 = "d2";
		var END_TURN_BUTTTON = "endTurnButton";
		var HUD = "hud";
		var LOWER_HUD = "lowerHud";

		/**
		 */
		function setVisibility(node, visible){
			node.style.visibility = visible;
			for(var it = 0; it < node.children.length; it++){
				setVisibility(node.children[it], visible);
			}
		}

		/**
		 * Private globals
		 */
		hud.d1 = undefined;
		hud.d2 = undefined;

		/**
		 * @method setup
		 */
		hud.setup = function(){
			setVisibility(document.getElementById(HUD), "visible");
			
			//Create the dice
			hud.d1 = new gh.Dice(
				6, 
				new graphics.SpriteStrip("./Data/Graphics/dice1.png", 6, 100, {"1" : 0, "2" : 1, "3" : 2, "4" : 3, "5" : 4, "6" : 5}),
				document.getElementById(DICE1),
				document.getElementById(DICE1).getContext("2d")
			);

			hud.d2 = new gh.Dice(
				6, 
				new graphics.SpriteStrip("./Data/Graphics/dice1.png", 6, 100, {"1" : 0, "2" : 1, "3" : 2, "4" : 3, "5" : 4, "6" : 5}),
				document.getElementById(DICE2),
				document.getElementById(DICE2).getContext("2d")
			);

			// Setup the active agent display
			document.getElementById("aaName").onclick = hud.aaButton;

			hud.setupInput();
			
		}

		hud.aaButton = function(){
			if(document.getElementById("aaDetails").style.maxHeight === "0px" || document.getElementById("aaDetails").style.maxHeight === ""){
				document.getElementById("aaDetails").style.maxHeight = "500px";
			} else {
				document.getElementById("aaDetails").style.maxHeight = "0px";
			}
		};

		/**
		 * @method update
		 */
		hud.update = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			document.getElementById("aaName").innerHTML = agent.uniqueID;
			document.getElementById("aaDescription").innerHTML = agent.description;

			var aaImage = document.getElementById("aaImage");
			var context = aaImage.getContext("2d");
			aaImage.width = aaImage.clientWidth;
			aaImage.height = aaImage.clientHeight;

			context.save();

			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, aaImage.width,aaImage.height);

			context.restore();

		}

		/**
		 * @method setupInput
		 */
		hud.setupInput = function(){
			document.getElementById(END_TURN_BUTTTON).onclick = hud.onEndTurn;
			var actionButtons = document.getElementsByClassName("actionButton");
			for(var it=0; it < actionButtons.length; it++){
				actionButtons[it].onclick = hud.onActionStateButton;				
			}
		};

		/**
		 * @method onEndTurn
		 */
		hud.onEndTurn = function(){
			/**
			 * Setup the next players turn
			 */
			gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().state = "inactive";
			gh.ptrActiveLevel.manager.setNextTurn();
			gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().startTurn();

			/**
			 * Hud maintenance re new turn
			 */
			hud.clearActionStateButtons();

			/**
			 * Center board view onto new agent
			 */
			gh.board.centerOn(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent());
		};

		/**
		 * @method onActionStateButton
		 */
		hud.onActionStateButton = function(){
			/**
			 * Handle the cosmetic changs of the actions state buttons
			 */
			var actionButtons = document.getElementsByClassName("actionButton");
			for(var it = 0; it < actionButtons.length; it++){
				actionButtons[it].style.backgroundColor = "rgba(163, 155, 138, 0.8)";
				actionButtons[it].style.borderStyle = "ridge";
			}
			this.style.borderStyle = "groove";
			this.style.backgroundColor = "rgba(78, 74, 67, 0.8)";

			/**
			 * Update the current player/agents action state
			 */
			switch(this.id){
				case "attack":
					gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().actionState = "attack";
					break;
				case "search":
					gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().actionState = "search";
					break;
				case "item":
					break;
				case "traps":
					gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().actionState = "traps";
					break;
				case "spell":
					break;
				default:
					console.log("invalid action button id value");
					break;
			};
		};

		/**
		 * @method clearActionStateButtons
		 */
		hud.clearActionStateButtons = function(){
			var actionButtons = document.getElementsByClassName("actionButton");
			for(var it = 0; it < actionButtons.length; it++){
				actionButtons[it].style.backgroundColor = "rgba(163, 155, 138, 0.8)";
				actionButtons[it].style.borderStyle = "ridge";
			}
		}

		/**
		 * @method displayAttack
		 * @param {} attack
		 */
		hud.displayAttack = function(numHitDice, hits, numDefenceDice, defence){
			document.getElementById("diceSplashScreen").style.visibility = "visible";
			setTimeout(
				function(){
					document.getElementById("diceSplashScreen").style.visibility = "hidden";
				},
				500
			);
			
		};


		return hud;
	})(hud || {});

	gh.hud = hud;
	return gh;
})(gh || {});