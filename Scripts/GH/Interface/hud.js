"use strict"

var gh = (function(gh){
	console.log("hud.js loaded");

	var hud = (function(hud){

		/**
		 * Private constants
		 */
		//var HUD 				= "hud";
		var HUD 				= document.getElementById("hud");
		var LOWER_HUD 			= "lowerHud";

		var DICE1 				= "d1";
		var DICE2 				= "d2";

		var END_TURN_BUTTTON 	= "endTurnButton";

		var AAD 				= "activeAgent"
		var AAD_ATTACK_DICE 	= "aadAttackDice";
		var AAD_DEFEND_DICE 	= "aadDefendDice";
		var AAD_BODY			= "aaBody";
		var AAD_MIND			= "aaMind";
		var AAD_IMAGE			= document.getElementById("aaImage");
		var AAD_OVERVIEW		= document.getElementById("aaOverview");
		var AAD_INVENTORY		= document.getElementById("aaInventory");

		/**
		 * Private globals
		 */
		hud.d1 = undefined;
		hud.d2 = undefined;

		/**
		 * Private methods
		 */

		/**
		 * This method sets the visibility of a given node and all of its children to the 
		 * given visibility.
		 * This method is no longer utilized by Grid Hack. Use stdlib.dom.setNodeTreeStyle instead.
		 * @method setVisibility
		 * @param {DOM} node
		 * @param {string} visible Acceptable parameters are "hidden" or "visible".
		 * @depreciated
		 */
		function setVisibility(node, visible){
			node.style.visibility = visible;
			for(var it = 0; it < node.children.length; it++){
				setVisibility(node.children[it], visible);
			}
		}

		/**
		 * Public Methods
		 */

		/**
		 * @method setup
		 */
		hud.setup = function(){
			stdlib.dom.setNodeTreeStyle(HUD, "visibility", "visible");
			
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

			hud.setupAAD();

			hud.setupInput();
		}

		/**
		 * Active Agent Display
		 */

		/**
		 * Setup the active agent display hud interface.
		 * This includes initializing the tab visibility and height parameters.
		 * @method setupAAD
		 */
		hud.setupAAD = function(){
			stdlib.dom.setNodeTreeStyle(AAD_OVERVIEW, "height", "100%");
			stdlib.dom.setNodeTreeStyle(AAD_INVENTORY, "height", "0px");

			var aaTabs = document.getElementsByClassName("aaTab");
			for(var it = 0; it < aaTabs.length; it++){
				aaTabs[it].onclick = aadTabOnClick;
			}		
		};

		/**
		 * This method responds to a click event on the active agent tabs and allowing the user
		 * to view different sets of information via the tabs.
		 * @method aaTabOnClick
		 */
		function aadTabOnClick(){
			// Set all the tabbed pages to a height of 0px.
			stdlib.dom.setNodeTreeStyle(AAD_OVERVIEW, "height", "0px");
			stdlib.dom.setNodeTreeStyle(AAD_INVENTORY, "height", "0px");

			// Set the height of the currently selected tab page's height to 100%.
			// Could potentially remove this switch statement if a standardized string
			// selector is utilized.
			switch(this.id){
				case "aaTabOverview":
					stdlib.dom.setNodeTreeStyle(AAD_OVERVIEW, "height", "100%");
					break;
				case "aaTabInventory":
					stdlib.dom.setNodeTreeStyle(AAD_INVENTORY, "height", "100%");
					break;
				default:
					break;
			}
		}

		/**
		 * @method update
		 */
		hud.update = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			
			// Update the Active Agent display
			document.getElementById("aaName").innerHTML = agent.uniqueID;
			document.getElementById("aaDescription").innerHTML = agent.description;

			var context = AAD_IMAGE.getContext("2d");
			AAD_IMAGE.width = aaImage.clientWidth;
			AAD_IMAGE.height = aaImage.clientWidth;
			
			var aadAtkDice = document.getElementById(AAD_ATTACK_DICE);
			aadAtkDice.innerHTML = agent.mainHand.attackDice;

			var aadDefDice = document.getElementById(AAD_DEFEND_DICE);
			aadDefDice.innerHTML = agent.getDefenceDice();

			document.getElementById(AAD_BODY).innerHTML = agent.getCurrentHealth();
			document.getElementById(AAD_MIND).innerHTML = agent.getCurrentMind();

			// Draw the image of the current agent
			context.save();

			gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, aaImage.width,aaImage.height);

			context.restore();
		}

		/**
		 * Handle any graphical updates to the hud which require drawing.
		 * @method render
		 */
		hud.render = function(){
			var moved = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().moved;
			if(moved > 6){
				var diff = moved - 6;
				hud.d2.draw(diff - 1, 0, 0, 100, 100);
				moved = moved - diff;
			} else {
				hud.d2.clear();
			}
			if(moved > 0){
				hud.d1.draw(moved - 1, 0, 0, 100, 100)
			} else {
				hud.d1.clear();
			}
		};

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
			// Clear the aad inventory
			stdlib.dom.removeChildren(AAD_INVENTORY);

			/**
			 * Setup the next players turn
			 */
			gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().state = "inactive";
			gh.ptrActiveLevel.manager.setNextTurn();
			gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().startTurn();

			// Load the current agent's inventory to the aad
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			for(var it = 0; it < agent.inventory.length; it++){
				var p = document.createElement("p");
				p.innerHTML = agent.inventory[it].name;
				p.className = "aaInventoryItem";
				AAD_INVENTORY.appendChild(p);
			}

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
		hud.displayAttack = function(numHitDice, hits, numDefenceDice, defence, defender){
			gh.dss.update(numHitDice, hits, numDefenceDice, defence, defender);
			gh.dss.setVisible(true);
			/*
			setTimeout(
				function(){
					gh.dss.setVisible(false);
					gh.dss.clear();
				},
				1000
			);
			*/
		};


		return hud;
	})(hud || {});

	gh.hud = hud;
	return gh;
})(gh || {});