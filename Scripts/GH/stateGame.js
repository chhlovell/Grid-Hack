"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){

	/**
	 * @class stateGame
	 * @constructor
	 * @method stateGame
	 */
	var stateGame = (function(stateGame){

		var timeStamp;
		var dt;
		var ptrFocus;

		function activeAgent(){
			return gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent();
		}

		/**
		 * This function is called at the end of and AI agent's turn.
		 * This method loads the next agent's turn.  This is done by first looking for
		 * the next agent in the current players roster, or if the last agent has 
		 * finished its turn, change to the next players turn with the fist agent in
		 * that players roster being the next one to proceed.
		 *
		 * At this juncture it is also necessary to clear the active agent display
		 * inventory list and load the new articles.
		 *
		 * @method endTurn
		 */
		function endTurn(){
			//gh.hud.onEndTurn();

			//Setup the next players turn
			gh.ptrActiveLevel.manager.endTurn();

			// Update the active agent display data
			gh.hud.setupAAD();

			// Center board view onto new agent
			gh.board.centerOn(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent());

			if(gh.ptrActiveLevel.manager.getActivePlayer().AI){
				timeStamp = Date.now();
				dt = 0;
			}
		}

		/**
		 * @method update
		 */
		stateGame.update = function(){
			gh.board.handleInput();

			var state 			= "stateGame";

			if(gh.ptrActiveLevel.isVictory(activeAgent().team)){
				console.log("victory");
				return "stateEnd";
			}

			if(gh.ptrActiveLevel.manager.getActivePlayer().AI){
				state = this.handleAITurn();
			} else {
				state = this.handlePlayerInput();
			}

			gh.hud.update();

			return state;
		};

		stateGame.handleAITurn = function(){
			var state = "stateGame";

			if(activeAgent().active){
				console.log(activeAgent);

				var opponents 	= activeAgent().getOpponents(gh.ptrActiveLevel.teams, gh.ptrActiveLevel.manager.getAllAgents());
				var target 		= activeAgent().getClosestOpponent(gh.ptrActiveLevel.teams, opponents);
				var path 		= gh.ptrActiveLevel.mapData.map.aStar(activeAgent(), target);

				if(path.length > 2 && activeAgent().moved > 1){
					dt = Date.now() - timeStamp;
					if(dt > 500){
						activeAgent().move(path[0].direction, gh.ptrActiveLevel.mapData.map.board);
						timeStamp = Date.now();
					}
				} else if(path.length > 1 || activeAgent().moved === 1){
					if(!(path[0].cell.agents && path[0].cell.agents.length > 0)){
						dt = Date.now() - timeStamp;
						if(dt > 500){
							activeAgent().move(path[0].direction, gh.ptrActiveLevel.mapData.map.board);
							timeStamp = Date.now();
						}
					} else {
						endTurn();
					}
				} else {
					// Try to attack the target.
					var atk = activeAgent().attack(target);

					// Display the attack splash screen
					if(atk !== null){
						// If the target has died remove it from the game.
						// Add a death blood/corpse splatter effect to the board.
						// Drop any loot.
						if(target.damageHealth(atk.damage) === "dead"){
							gh.ptrActiveLevel.mapData.map.board[target.y][target.x].effects.push(gh.assets.sprites["blood-splatter.gif"]);
							console.log(gh.ptrActiveLevel.mapData.map.board[target.y][target.x]);
							gh.ptrActiveLevel.mapData.map.board[target.y][target.x].removeAgent(target);
						}

						//gh.hud.displayAttack(activeAgent().mainHand.attackDice, atk.hits, target.getDefenceDice(), atk.defence, target);
						gh.stateSplashScreen.load(activeAgent().mainHand.attackDice, atk.hits, target.getDefenceDice(), atk.defence, target);
						state = "stateSplashScreen";
					}
					endTurn();
				}
			} else {
				endTurn();
			}

			return state;
		};

		stateGame.handlePlayerInput = function(){
			var state = "stateGame";

			// handle agent input
			var key = input.keyboard.key;

			// Spacebar to center on active agent
			if(key[input.keyboard.SPACE] && key[input.keyboard.SPACE].pressed){
				gh.board.centerOn(activeAgent());
			}

			//Handle agent movement 
			if(input.keyboard.isPressed(input.keyboard.A) && !input.keyboard.isRepeat(input.keyboard.A)){
				activeAgent().move("left", gh.ptrActiveLevel.mapData.map.board);
				input.keyboard.key[input.keyboard.A].pressed = false;
				input.keyboard.key[input.keyboard.A].repeat = false;
			}
			if(input.keyboard.isPressed(input.keyboard.D) && !input.keyboard.isRepeat(input.keyboard.D)){
				activeAgent().move("right", gh.ptrActiveLevel.mapData.map.board);
				input.keyboard.key[input.keyboard.D].pressed = false;
				input.keyboard.key[input.keyboard.D].repeat = false;
			}
			if(input.keyboard.isPressed(input.keyboard.W) && !input.keyboard.isRepeat(input.keyboard.W)){
				activeAgent().move("up", gh.ptrActiveLevel.mapData.map.board);
				input.keyboard.key[input.keyboard.W].pressed = false;
				input.keyboard.key[input.keyboard.W].repeat = false;
			}
			if(input.keyboard.isPressed(input.keyboard.S) && !input.keyboard.isRepeat(input.keyboard.S)){
				activeAgent().move("down", gh.ptrActiveLevel.mapData.map.board);
				input.keyboard.key[input.keyboard.S].pressed = false;
				input.keyboard.key[input.keyboard.S].repeat = false;
			}


			// Handle mouse input.

			var pt = gh.board.mouseToCell();
			var map = gh.ptrActiveLevel.mapData.map.board;

			// Clear the current mouse focus.
			if(ptrFocus){
				ptrFocus.focus = false;
			}
			// Update mouse focus.
			if(map[pt.y]){
				if(map[pt.y][pt.x]){
					var cell = map[pt.y][pt.x];
					if(cell.visible){
						ptrFocus = cell.setMouseFocus(
							input.mouse.x,
							input.mouse.y,
							gh.board.tileSize,
							gh.board.scale,
							gh.board.offset,
							gh.assets.sprites
						);	
					}
				}
			}

			// Handle mouse click events.
			if(input.mouse.clicked){
				input.mouse.clicked = false;

				if(map[pt.y]){
					if(map[pt.y][pt.x]){
						var cell = map[pt.y][pt.x];
						if(cell.visible){
							state = cell.onClick(input.mouse.x, input.mouse.y, gh.board.tileSize, gh.board.scale, gh.board.offset, gh.assets.sprites, activeAgent());
						}
					}
				}
			}

			return state;
		};

		/**
		 * @method render
		 */
		stateGame.render = function(){
			//gh.board.draw(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().team);
			gh.board.draw("Empire");
			var fps = document.getElementById("performance");
			fps.innerHTML = "FPS: " + graphics.fps.getFPS();

			gh.hud.render();

			return true;
		};

		return stateGame;
	})(stateGame || {});

	gh.stateGame = stateGame;
	return gh;
})(gh || {});