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

		function endTurn(){
			gh.ptrActiveLevel.manager.setNextTurn();
			gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().startTurn();
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

			var manager = gh.ptrActiveLevel.manager;
			var activePlayer = manager.getActivePlayer();
			var activeAgent = activePlayer.getActiveAgent();

			if(activePlayer.AI){
				if(activeAgent.active){
					console.log(activeAgent);

					/**
					 * The AI
					 *
					 * MOVE THIS TO EITHER AGENT OR AN INDEPENDENT CLASS/OBJECT STRUCTURE
					 *
					 * Attack the target if in range
					 * Determine the most suitable target
					 * Move to within range of target
					 *
					 */

					var opponents = activeAgent.getOpponents(gh.ptrActiveLevel.teams, gh.ptrActiveLevel.manager.getAllAgents());
					var target = activeAgent.getClosestOpponent(gh.ptrActiveLevel.teams, opponents);
					var path = gh.ptrActiveLevel.mapData.map.aStar(activeAgent, target);

					if(path.length > 2 && activeAgent.moved > 1){
						dt = Date.now() - timeStamp;
						if(dt > 500){
							activeAgent.move(path[0].direction, gh.ptrActiveLevel.mapData.map.board);
							timeStamp = Date.now();
						}
					} else if(path.length > 1 || activeAgent.moved === 1){
						if(!(path[0].cell.agents && path[0].cell.agents.length > 0)){
							console.log(dt);
							dt = Date.now() - timeStamp;
							if(dt > 500){
								activeAgent.move(path[0].direction, gh.ptrActiveLevel.mapData.map.board);
								timeStamp = Date.now();
							}
						} else {
							endTurn();
						}
					} else {
						endTurn();
					}
				} else {
					endTurn();
				}
			} else {
				/**
				 * handle agent input
				 */
				var key = input.keyboard.key;

				/**
				 * Spacebar to center on active agent
				 */
				if(key[input.keyboard.SPACE] && key[input.keyboard.SPACE].pressed){
					var agent = activePlayer.getActiveAgent();
					gh.board.centerOn(agent);
				}

				/**
				 * Handle agent movement 
				 */
				if(input.keyboard.isPressed(input.keyboard.A) && !input.keyboard.isRepeat(input.keyboard.A)){
					activeAgent.move("left", gh.ptrActiveLevel.mapData.map.board);
					input.keyboard.key[input.keyboard.A].pressed = false;
					input.keyboard.key[input.keyboard.A].repeat = false;
				}
				if(input.keyboard.isPressed(input.keyboard.D) && !input.keyboard.isRepeat(input.keyboard.D)){
					activeAgent.move("right", gh.ptrActiveLevel.mapData.map.board);
					input.keyboard.key[input.keyboard.D].pressed = false;
					input.keyboard.key[input.keyboard.D].repeat = false;
				}
				if(input.keyboard.isPressed(input.keyboard.W) && !input.keyboard.isRepeat(input.keyboard.W)){
					activeAgent.move("up", gh.ptrActiveLevel.mapData.map.board);
					input.keyboard.key[input.keyboard.W].pressed = false;
					input.keyboard.key[input.keyboard.W].repeat = false;
				}
				if(input.keyboard.isPressed(input.keyboard.S) && !input.keyboard.isRepeat(input.keyboard.S)){
					activeAgent.move("down", gh.ptrActiveLevel.mapData.map.board);
					input.keyboard.key[input.keyboard.S].pressed = false;
					input.keyboard.key[input.keyboard.S].repeat = false;
				}

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
							cell.onClick(
								input.mouse.x,
								input.mouse.y,
								gh.board.tileSize,
								gh.board.scale,
								gh.board.offset,
								gh.assets.sprites,
								activePlayer.getActiveAgent()
							);
						}
					}
				}
			}

			gh.hud.update();

			return "stateGame";
		};

		/**
		 * @method render
		 */
		stateGame.render = function(){
			//gh.board.draw(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().team);
			gh.board.draw("Empire");
			var fps = document.getElementById("performance");
			fps.innerHTML = "FPS: " + graphics.fps.getFPS();

			/**
			 * Draw the dice
			 * Should probably move this to the hud js file
			 */
			var moved = gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().moved;
			if(moved > 6){
				var diff = moved - 6;
				gh.hud.d2.draw(diff - 1, 0, 0, 100, 100);
				moved = moved - diff;
			} else {
				gh.hud.d2.clear();
			}
			if(moved > 0){
				gh.hud.d1.draw(moved - 1, 0, 0, 100, 100)
			} else {
				gh.hud.d1.clear();
			}

			return true;
		};

		return stateGame;
	})(stateGame || {});

	gh.stateGame = stateGame;
	return gh;
})(gh || {});