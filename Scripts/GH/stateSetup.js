"use strict"

/**
 * @module gh
 */

/** 
 * @class gh
 */
var gh = (function(gh){
	console.log("stateSetup.js loaded");

	/**
	 * The role of the stateSetup class is to provide the mechanics for setting up the game board prior to
	 * running the actual game.  This includes player placement of heroes on the board if there are entry
	 * triggers.  Note that entry/exit doors opperated in a different manner and utilized as part of the 
	 * actual game.
	 * @class stateSetup
	 * @constructor
	 * @return
	 */
	var stateSetup = (function(stateSetup){

		/**
		 * For the moment assume that the game has only one player who is playing against the computer.
		 * @method update
		 * @return
		 */
		stateSetup.update = function(){
			var placed 			= false;
			var manager 		= gh.ptrActiveLevel.manager;
			var activePlayer 	= manager.getActivePlayer();
			var activeAgent 	= null;
			
			if(activePlayer){
				activeAgent = activePlayer.getActiveAgent();
			}

			var key = input.keyboard.key;
			if(key[input.keyboard.SPACE] && key[input.keyboard.SPACE].pressed){
				gh.board.offset.x = 0;
				gh.board.offset.y = 0;
			}


			gh.board.handleInput();

			if(input.mouse.clicked){
				input.mouse.clicked = false;

				var pt = gh.board.mouseToCell();
				

				// what was clicked
				// was a hud element clicked?

				// if not, was a board element clicked?
				// was an entry trigger clicked? (vs later an exit trigger clicked?)
				//		NB all other 'triggers' respond to agent movement and are not visually displayed
				// was an agent clicked
				// was an item clicked
				// was a border clicked
				// was a tile clicked

				if(gh.ptrActiveLevel.mapData.map.board[pt.y]){
					if(gh.ptrActiveLevel.mapData.map.board[pt.y][pt.x]){
						var cell = gh.ptrActiveLevel.mapData.map.board[pt.y][pt.x];
						var obj = cell.getClicked(
							input.mouse.x, 
							input.mouse.y, 
							gh.board.tileSize, 
							gh.board.scale, 
							gh.board.offset, 
							gh.assets.sprites
						);

						if(obj && obj instanceof gh.EntryTrigger){
							placed = obj.onClick(activePlayer.roster, gh.ptrActiveLevel.mapData.map.board);
						}
					}
				}
			}

			if(placed){
				/**
				 * Proceed to stateGame.
				 * Initialize the game hud and stateGame objects.
				 */

				gh.hud.setup();

				// Disable the entry triggers
				// Activate the other triggers
				var triggers = gh.ptrActiveLevel.mapData.triggers;
				for(var it = 0; it < triggers.length; it++){
					if(triggers[it] instanceof gh.EntryTrigger){
						triggers[it].active = false;
					} else {
						triggers[it].active = true;
					}
				}

				// Set the current agent's turn to active
				var agent = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
				agent.startTurn();

				return "stateGame";
			}
			
			return "stateSetup";
		};

		/**
		 * @method render
		 * @return
		 */
		stateSetup.render = function(){
			gh.board.draw(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().team);
			var fps = document.getElementById("performance");
			fps.innerHTML = "FPS: " + graphics.fps.getFPS();

			/*
			var canvas = gh.display.layers[0].canvas;
			var context = gh.display.layers[0].context;
			*/

			return true;
		};

		return stateSetup;
	})(stateSetup || {});

	gh.stateSetup = stateSetup;
	return gh;
})(gh || {});