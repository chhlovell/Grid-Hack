"use strict"

var gh = (function(gh){
	console.log("hud.js loaded");

	var hud = (function(hud){

		/**
		 * Private constants
		 */
		var HUD 				= document.getElementById("hud");

		var DICE1 				= "d1";
		var DICE2 				= "d2";

		var END_TURN_BUTTON 	= document.getElementById("endTurn");

		var AAD 				= document.getElementById("aaDisplay");
		var AAD_HEADINGS		= document.getElementsByClassName("aaHeading");
		var AAD_NAME 			= document.getElementById("aaName");
		var AAD_DESCRIPTION 	= document.getElementById("aaDescription");
		var AAD_IMAGE			= document.getElementById("aaImage");

		var AAD_WEAPONS_HEADING = document.getElementById("aaWeaponsHeading");
		var AAD_WEAPONS			= document.getElementById("aaWeapons");
		var AAD_ARMOUR_HEADING	= document.getElementById("aaArmourHeading");
		var AAD_ARMOUR			= document.getElementById("aaArmour");
		var AAD_SPELLS			= document.getElementById("aaSpells");
		var AAD_EQUIPMENT		= document.getElementById("aaEquipment");

		var AAD_BODY			= document.getElementById("aaBody");
		var	AAD_MIND			= document.getElementById("aaMind");

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
		function activeAgent(){
			return gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
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
				new graphics.SpriteStrip(
					"./Data/Graphics/dice1.png", 
					6, 
					100, 
					{"1" : 0, "2" : 1, "3" : 2, "4" : 3, "5" : 4, "6" : 5}
				),
				document.getElementById(DICE1),
				document.getElementById(DICE1).getContext("2d")
			);

			hud.d2 = new gh.Dice(
				6, 
				new graphics.SpriteStrip(
					"./Data/Graphics/dice1.png", 
					6, 
					100, 
					{"1" : 0, "2" : 1, "3" : 2, "4" : 3, "5" : 4, "6" : 5}
				),
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
			gh.assets.sprites["dagger"]					= new graphics.Sprite("./Data/Graphics/Interface/dagger.gif");
			gh.assets.sprites["longsword"] 				= new graphics.Sprite("./Data/Graphics/Interface/longsword.gif");
			gh.assets.sprites["shortsword"] 			= new graphics.Sprite("./Data/Graphics/Interface/shortsword.gif");
			gh.assets.sprites["unarmed"]				= new graphics.Sprite("./Data/Graphics/Interface/unarmed.gif");

			gh.assets.sprites["chainmail"]				= new graphics.Sprite("./Data/Graphics/Interface/chainmail.gif");
			gh.assets.sprites["helmet"]					= new graphics.Sprite("./Data/Graphics/Interface/helmet.gif");
			gh.assets.sprites["natural"] 				= new graphics.Sprite("./Data/Graphics/Interface/natural.gif");
			gh.assets.sprites["shield"]					= new graphics.Sprite("./Data/Graphics/Interface/shield.gif");

			gh.assets.sprites["Gem"]					= new graphics.Sprite("./Data/Graphics/Interface/Gem.gif");
			gh.assets.sprites["Gold"]					= new graphics.Sprite("./Data/Graphics/Interface/Gold.gif");
			gh.assets.sprites["Jewel"]					= new graphics.Sprite("./Data/Graphics/Interface/Jewels.gif");	
			gh.assets.sprites["Potion of Healing"] 		= new graphics.Sprite("./Data/Graphics/Interface/Potion of Healing.gif");
			gh.assets.sprites["Heroic Brew"] 			= new graphics.Sprite("./Data/Graphics/Interface/Heroic Brew.gif");
			gh.assets.sprites["Potion of Defence"] 		= new graphics.Sprite("./Data/Graphics/Interface/Potion of Defence.gif");
			gh.assets.sprites["Potion of Strength"]		= new graphics.Sprite("./Data/Graphics/Interface/Potion of Strength.gif");
		};

		/**
		 * @method update
		 */
		hud.update = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();


			// Update the active image display.
			AAD_IMAGE.width = AAD_IMAGE.clientWidth;
			AAD_IMAGE.height = AAD_IMAGE.clientWidth;

			AAD_WEAPONS_HEADING.innerHTML = "Weapons : " + agent.getAttackDice();
			AAD_ARMOUR_HEADING.innerHTML = "Armour : " + agent.getDefenceDice();

			AAD_BODY.innerHTML = agent.getCurrentHealth();
			AAD_MIND.innerHTML = agent.getCurrentMind();
		};

		/**
		 * Handle any graphical updates to the hud which require drawing.
		 * @method render
		 */
		hud.render = function(){
			var agent 	= gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();

			// Draw the active agent display current agent image.
			var context = AAD_IMAGE.getContext("2d");
			gh.assets.sprites[agent.sprites.display].draw(context, 0, 0, AAD_IMAGE.width, AAD_IMAGE.height);

			// Update the move dice in the active agent display.
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
		 * @method displayAttack
		 * @param {} attack
		 */
		hud.displayAttack = function(numHitDice, hits, numDefenceDice, defence, defender){
			gh.dss.update(numHitDice, hits, numDefenceDice, defence, defender);
			gh.dss.setVisible(true);
		};

		/**************************************************************************************************************
		 * ACTIVE AGENT DISPLAY
		 *************************************************************************************************************/

		/**
		 * Setup the active agent display hud interface.
		 * This includes initializing the tab visibility and height parameters.
		 * @method setupAAD
		 */
		hud.setupAAD = function(){
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();

			// Setup the AAD agent heading tabs input events
			for(var it = 0; it < AAD_HEADINGS.length; it++){
				AAD_HEADINGS[it].onclick = hud.onAADClick;
			}

			// Setup the AAD agent descriptive overview
			AAD_NAME.innerHTML 			= agent.name;
			AAD_DESCRIPTION.innerHTML 	= agent.description;

			// Remove and child icons in the action tab
			stdlib.dom.removeChildren(AAD_WEAPONS);
			stdlib.dom.removeChildren(AAD_ARMOUR);
			stdlib.dom.removeChildren(AAD_SPELLS);
			stdlib.dom.removeChildren(AAD_EQUIPMENT)

			// Load the natural armour into the armour tab prior to loading the genral inventory.
			var w = document.createElement("canvas");
			AAD_ARMOUR.appendChild(w);
			w.onclick 		= hud.onArmourClick;
			w.className 	= "aaIconEquiped";
			w.id 			= agent.baseDefence.uniqueID;
			w.width 		= w.clientWidth;
			w.height 		= w.clientHeight;
			var ctx 		= w.getContext("2d");
			gh.assets.sprites[agent.baseDefence.name].draw(ctx, 0, 0, w.width, w.height);

			// Setup the inventory tabs (weaopns, armour, equipment)
			for(var it = 0; it < agent.inventory.length; it++){
				var w = document.createElement("canvas");

				if(agent.inventory[it] instanceof gh.Weapon){
					AAD_WEAPONS.appendChild(w);
					w.onclick = hud.onWeaponClick;
				} else if(agent.inventory[it] instanceof gh.Armour){
					AAD_ARMOUR.appendChild(w);
					w.onclick = hud.onArmourClick;
				} else {
					AAD_EQUIPMENT.appendChild(w);
				}

				if(agent.isEquiped(agent.inventory[it])){
					w.className = "aaIconEquiped";
				} else {
					w.className = "aaIcon";	
				}
				w.id 			= agent.inventory[it].uniqueID;
				w.width 		= w.clientWidth;
				w.height 		= w.clientHeight;
				var ctx 		= w.getContext("2d");

				if(gh.assets.sprites[agent.inventory[it].name]){
					gh.assets.sprites[agent.inventory[it].name].draw(ctx, 0, 0, w.width, w.height);
				} else {
					// draw some default icon if we don't have graphics.
				}

				w.style.maxHeight = w.parentNode.style.maxHeight;
			}
		};

		/**
		 * @method onWeaponClick
		 */
		hud.onWeaponClick = function(){
			if(gh.ptrActiveLevel.manager.getActivePlayer().AI === gh.AI.COMPUTER){
				return;
			}

			var w;
			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			var inventory = agent.inventory;
			for(var it = 0; it < inventory.length && inventory[it].uniqueID !== this.id; it++){

			}
			if(agent.isEquiped(inventory[it])){
				agent.unequip(inventory[it]);
			} else {
				agent.equip(inventory[it]);
			}

			// Update the weapon icons.
			var c = AAD_WEAPONS.children;
			for(var it = 0; it < c.length; it++){
				var item = agent.findItem(c[it].id);
				if(agent.isEquiped(item)){
					c[it].className = "aaIconEquiped";
				} else {
					c[it].className = "aaIcon";
				}
			}

			// Update the armour icons.
			c = AAD_ARMOUR.children;
			for(var it = 0; it < c.length; it++){
				var item = agent.findItem(c[it].id);
			}
		};

		/**
		 * @method onArmourClick
		 */
		hud.onArmourClick = function(){
			if(gh.ptrActiveLevel.manager.getActivePlayer().AI === gh.AI.COMPUTER){
				return;
			}

			var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
			var inventory = agent.inventory;
			var item = agent.findItem(this.id);

			if(item !== agent.baseDefence){
				if(agent.isEquiped(item)){
					agent.unequip(item);
				} else {
					console.log("equip");
					agent.equip(item);
				}

				var c = AAD_ARMOUR.children;
				for(var it = 0; it < c.length; it++){
					var i = agent.findItem(c[it].id);
					if(agent.isEquiped(i)){
						c[it].className = "aaIconEquiped";
					} else {
						if(i.slot !== "baseDefence"){
							c[it].className = "aaIcon";
						}
					}
				}
			}

		}

		/**
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


		/**************************************************************************************************************
		 * END TURN BUTTON
		 *************************************************************************************************************/

		/**
		 * This event fires when the 'end turn' button has been clicked by a user.
		 * @method onEndTurn
		 */
		hud.onEndTurn = function(){
			// Prevent the user from pressing the end turn button during a computer
			// agent's turn.
			if(activeAgent().AI){
				return;
			}

			//Setup the next players turn
			gh.ptrActiveLevel.manager.endTurn();

			// Update the active agent display data
			hud.setupAAD();

			// Center board view onto new agent
			gh.board.centerOn(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent());
		};

		return hud;
	})(hud || {});

	gh.hud = hud;
	return gh;
})(gh || {});