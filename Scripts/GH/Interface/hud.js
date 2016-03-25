"use strict"

var gh = (function(gh){
	console.log("hud.js loaded");

	var hud = (function(hud){

		/**
		 * Private constants
		 */
		//var HUD 				= "hud";
		var HUD 				= document.getElementById("hud");

		var DICE1 				= "d1";
		var DICE2 				= "d2";

		var END_TURN_BUTTON 	= document.getElementById("endTurn");

		var AAD 				= document.getElementById("aaDisplay");
		var AAD_HEADINGS		= document.getElementsByClassName("aaHeading");
		var AAD_NAME 			= document.getElementById("aaName");
		var AAD_DESCRIPTION 	= document.getElementById("aaDescription");
		var AAD_IMAGE			= document.getElementById("aaImage");

		var AAD_WEAPONS			= document.getElementById("aaWeapons");
		var AAD_ARMOUR			= document.getElementById("aaArmour");
		var AAD_SPELLS			= document.getElementById("aaSpells");
		var AAD_EQUIPMENT		= document.getElementById("aaEquipment");

		var AAD_ATTACK_DICE 	= "aadAttackDice";
		var AAD_DEFEND_DICE 	= "aadDefendDice";

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
		 * Preload the canvas and audio files for the hud.
		 * This function should be called prior to the game running to ensure the appropriate graphics
		 * are loaded.
		 * @method loadAssets
		 */
		hud.loadAssets = function(){
			// Load the AAD canvas graphics
			gh.assets.sprites["dagger"]			= new graphics.Sprite("./Data/Graphics/Interface/dagger.gif");
			gh.assets.sprites["longsword"] 		= new graphics.Sprite("./Data/Graphics/Interface/longsword.gif");
			gh.assets.sprites["shortsword"] 	= new graphics.Sprite("./Data/Graphics/Interface/shortsword.gif");
			gh.assets.sprites["unarmed"]		= new graphics.Sprite("./Data/Graphics/Interface/unarmed.gif");

			gh.assets.sprites["chainmail"]		= new graphics.Sprite("./Data/Graphics/Interface/chainmail.gif");
			gh.assets.sprites["helmet"]			= new graphics.Sprite("./Data/Graphics/Interface/helmet.gif");
			gh.assets.sprites["shield"]			= new graphics.Sprite("./Data/Graphics/Interface/shield.gif");
		};

		/**
		 * Active Agent Display
		 */

		/**
		 * Setup the active agent display hud interface.
		 * This includes initializing the tab visibility and height parameters.
		 * @method setupAAD
		 */
		hud.setupAAD = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			console.log(agent);

			// Setup the AAD agent heading tabs input events
			for(var it = 0; it < AAD_HEADINGS.length; it++){
				AAD_HEADINGS[it].onclick = hud.onAADClick;
			}

			// Setup the AAD agent descriptive overview
			AAD_NAME.innerHTML = agent.uniqueID;
			AAD_DESCRIPTION.innerHTML = agent.description;

			// Remove and child icons in the action tab
			stdlib.dom.removeChildren(AAD_WEAPONS);
			stdlib.dom.removeChildren(AAD_ARMOUR);
			//stdlib.dom.removeChildren(AAD_SPELLS);
			stdlib.dom.removeChildren(AAD_EQUIPMENT)


			// Setup the inventory tabs (weaopns, armour, equipment)
			for(var it = 0; it < agent.inventory.length; it++){
				var w = document.createElement("canvas");

				if(agent.isEquiped(agent.inventory[it])){
					//console.log("equiped");
					w.style.borderColor = "yellow";
				}

				if(agent.inventory[it] instanceof gh.Weapon){
					AAD_WEAPONS.appendChild(w);
				} else if(agent.inventory[it] instanceof gh.Armour){
					AAD_ARMOUR.appendChild(w);
				} else {
					AAD_EQUIPMENT.appendChild(w);
				}

				w.className = "aaIcon";
				w.width = w.clientWidth;
				w.height = w.clientHeight;
				var ctx = w.getContext("2d");

				if(gh.assets.sprites[agent.inventory[it].name]){
					gh.assets.sprites[agent.inventory[it].name].draw(ctx, 0, 0, w.width, w.height);
				} else {
					// draw some default icon if we don't have graphics.
				}

				w.style.maxHeight = w.parentNode.style.maxHeight;
			}
		};

		/**
		 * @method update
		 */
		hud.update = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();


			// Update the active image display.
			AAD_IMAGE.width = AAD_IMAGE.clientWidth;
			AAD_IMAGE.height = AAD_IMAGE.clientWidth;
			
			// Update the Active Agent display

			/*
			document.getElementById("aaName").innerHTML = agent.uniqueID;
			document.getElementById("aaDescription").innerHTML = agent.description;

			var context = AAD_IMAGE.getContext("2d");
			
			var aadAtkDice = document.getElementById(AAD_ATTACK_DICE);
			aadAtkDice.innerHTML = agent.mainHand.attackDice;

			var aadDefDice = document.getElementById(AAD_DEFEND_DICE);
			aadDefDice.innerHTML = agent.getDefenceDice();

			document.getElementById(AAD_BODY).innerHTML = agent.getCurrentHealth();
			document.getElementById(AAD_MIND).innerHTML = agent.getCurrentMind();
			*/

			// Draw the image of the current agent

			/*
			context.save();

			gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, aaImage.width,aaImage.height);

			context.restore();
			*/
		}

		/**
		 * Handle any graphical updates to the hud which require drawing.
		 * @method render
		 */
		hud.render = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			var context = AAD_IMAGE.getContext("2d");

/*
			console.log(AAD_IMAGE.width);
			console.log(AAD_IMAGE.clientWidth);
*/

			gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, AAD_IMAGE.width, AAD_IMAGE.height);

			//gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, 150, 150);
			
			var moved = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().moved;
			if(moved > 6){
				var diff = moved - 6;
				hud.d2.draw(diff - 1, 0, 0, 40, 40);
				moved = moved - diff;
			} else {
				hud.d2.clear();
			}
			if(moved > 0){
				hud.d1.draw(moved - 1, 0, 0, 40, 40)
			} else {
				hud.d1.clear();
			}
			
		};

		/**
		 * @method setupInput
		 */
		hud.setupInput = function(){
			END_TURN_BUTTON.onclick = hud.onEndTurn;
		};

		/**
		 * This event fires when the 'end turn' button has been clicked by a user.
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
			 * Update the active agent display data
			 */
			hud.setupAAD();

			/**
			 * Center board view onto new agent
			 */
			gh.board.centerOn(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent());
		};

		/**
		 * This event is called when an active agent display heading is clicked. When clicked,
		 * the content of the heading is either hidden or displayed, depending on its prior
		 * state.
		 * @method onAADClick
		 */
		hud.onAADClick = function(){
			var tab = this.nextElementSibling;

			if(tab.style.maxHeight === ""){
				stdlib.dom.setNodeTreeStyle(tab, "maxHeight", "0px");
			} else {
				stdlib.dom.setNodeTreeStyle(tab, "maxHeight", "");
			}
		};

		/**
		 * @method displayAttack
		 * @param {} attack
		 */
		hud.displayAttack = function(numHitDice, hits, numDefenceDice, defence, defender){
			gh.dss.update(numHitDice, hits, numDefenceDice, defence, defender);
			gh.dss.setVisible(true);
		};


		return hud;
	})(hud || {});

	gh.hud = hud;
	return gh;
})(gh || {});