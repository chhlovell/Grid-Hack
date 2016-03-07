"use strict"

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("gh.js loaded");

	/**
	 *  Public globals
	 */

	gh.divDisplay 			= null; // div element wich contains the display canvases.
	gh.display 				= null; // A display object which contains the canvases.
	gh.ptrGameState     	= "stateSetup";
	gh.ptrActiveCampaign	= null;
	gh.ptrActiveLevel 		= null;

	/**
	 * Public methods
	 */

	/**
	 * Prior to running the game the following aspects must be initialized/setup:
	 * o The display
	 * o The input
	 * o The graphics
	 * o Load the campaign/level data
	 *
	 * @method setup
	 * @param {string} divDisplay
	 * @param {string} canvasHud
	 * @param {string} canvasBoard
	 * @return
	 */
	gh.setup = function(divDisplay, canvasHud, canvasBoard){
		console.log("gh.js setup");

		// Load the campaign and level data
		gh.ptrActiveCampaign 	= gh.json.loadCampaign("Hero Quest");
		gh.ptrActiveLevel 		= gh.ptrActiveCampaign.ptrActiveLevel;

		// Setup the players
		gh.setupPlayer();
		gh.ptrActiveLevel.manager.activePlayer = 1;

		// Setup the board display
		gh.divDisplay 			= document.getElementById(divDisplay);
		//gh.divDisplay			= document.body;
		gh.display 				= new graphics.Display(divDisplay);

		// Load the graphics assets
		gh.json.loadAssets(gh.assets, "Hero Quest", "The Trial");

		// Setup the hud and input interface
		gh.setupDisplay(gh.divDisplay, canvasHud, canvasBoard);
		gh.setupInput();

		// Setup the map visibility
		gh.ptrActiveLevel.setupVisibility();

		return true;
	};

	/**
	 * This it a 'test' function which preloads a player with agents for use in the game.
	 * @method setupPlayer
	 * @return
	 */
	gh.setupPlayer = function(){
		var manager = gh.ptrActiveLevel.manager;
		var roster = [];
		var jsonAgentTemplates = gh.json.getData("./Data/Campaigns/Hero Quest/Data/creatures.json");
		var jsonWeaponTemplates = gh.json.getData("./Data/Campaigns/Hero Quest/Data/weapons.json");

		var type = "Barbarian";
		var agent = new gh.Agent(
			type,
			type,
			null,
			null,
			null,
			"Empire",
			jsonAgentTemplates[type].description,
			jsonAgentTemplates[type].body,
			jsonAgentTemplates[type].mind,
			jsonAgentTemplates[type].baseDefence,
			gh.json.getWeapon(jsonAgentTemplates[type].mainHand, jsonWeaponTemplates),
			jsonAgentTemplates[type].offHand,
			jsonAgentTemplates[type].chest,
			jsonAgentTemplates[type].head,
			jsonAgentTemplates[type].moveDice,
			jsonAgentTemplates[type].baseMove,
			jsonAgentTemplates[type].spellList,
			jsonAgentTemplates[type].inventory,
			jsonAgentTemplates[type].sprites,
			jsonAgentTemplates[type].animations
		);
		agent.active = true;
		agent.protagonist = true;
		roster.push(agent);

		type = "Elf";
		agent = new gh.Agent(
			type,
			type,
			null,
			null,
			null,
			"Empire",
			jsonAgentTemplates[type].description,
			jsonAgentTemplates[type].body,
			jsonAgentTemplates[type].mind,
			jsonAgentTemplates[type].baseDefence,
			gh.json.getWeapon(jsonAgentTemplates[type].mainHand, jsonWeaponTemplates),
			jsonAgentTemplates[type].offHand,
			jsonAgentTemplates[type].chest,
			jsonAgentTemplates[type].head,
			jsonAgentTemplates[type].moveDice,
			jsonAgentTemplates[type].baseMove,
			jsonAgentTemplates[type].spellList,
			jsonAgentTemplates[type].inventory,
			jsonAgentTemplates[type].sprites,
			jsonAgentTemplates[type].animations
		);
		agent.active = true;
		agent.protagonist = true;
		roster.push(agent);

		type = "Dwarf";
		agent = new gh.Agent(
			type,
			type,
			null,
			null,
			null,
			"Empire",
			jsonAgentTemplates[type].description,
			jsonAgentTemplates[type].body,
			jsonAgentTemplates[type].mind,
			jsonAgentTemplates[type].baseDefence,
			gh.json.getWeapon(jsonAgentTemplates[type].mainHand, jsonWeaponTemplates),
			jsonAgentTemplates[type].offHand,
			jsonAgentTemplates[type].chest,
			jsonAgentTemplates[type].head,
			jsonAgentTemplates[type].moveDice,
			jsonAgentTemplates[type].baseMove,
			jsonAgentTemplates[type].spellList,
			jsonAgentTemplates[type].inventory,
			jsonAgentTemplates[type].sprites,
			jsonAgentTemplates[type].animations
		);
		agent.protagonist = true;
		agent.active = true;
		roster.push(agent);

		var type = "Wizard";
		agent = new gh.Agent(
			type,
			type,
			null,
			null,
			null,
			"Empire",
			jsonAgentTemplates[type].description,
			jsonAgentTemplates[type].body,
			jsonAgentTemplates[type].mind,
			jsonAgentTemplates[type].baseDefence,
			gh.json.getWeapon(jsonAgentTemplates[type].mainHand, jsonWeaponTemplates),
			jsonAgentTemplates[type].offHand,
			jsonAgentTemplates[type].chest,
			jsonAgentTemplates[type].head,
			jsonAgentTemplates[type].moveDice,
			jsonAgentTemplates[type].baseMove,
			jsonAgentTemplates[type].spellList,
			jsonAgentTemplates[type].inventory,
			jsonAgentTemplates[type].sprites,
			jsonAgentTemplates[type].animations
		);
		agent.protagonist = true;
		agent.active = true;
		roster.push(agent);

		var player = new gh.Player("Chris", gh.AI.HUMAN, roster);

		manager.addPlayer(player);

		return true;
	};

	/**
	 * Initialize the games display.  This includes creating canvas objects for both the hud and the
	 * game board.
	 * @method setupDisplay
	 * @param {string} divDisplay Id of the containing div DOM object.
	 * @param {string} canvasHud Id of the hud canvas DOM object.
	 * @param {string} canvasBoard Id of the board canvas DOM object.
	 * @return
	 */	
	gh.setupDisplay = function(divDisplay, canvasHud, canvasBoard){
		
		var width 		= gh.divDisplay.clientWidth;
		var height 		= gh.divDisplay.clientHeight;

		gh.board = new gh.Board(canvasBoard, width, height);

		window.onresize = function(){
			var display = document.body;
			//var display = document.getElementById("all");
			if(display){
				gh.board.canvas2d.resize("0px", "0px", display.clientWidth, display.clientHeight);
			}
		};

		return true;
	};

	/**
	 * Setup the mouse and keyboard input for processing.
	 * @method setupInput
	 * @return
	 */
	gh.setupInput = function(){
		gh.divDisplay.onmousemove 	= input.mouse.onMouseMove;
		gh.divDisplay.onclick 		= input.mouse.onClick;

		window.onkeydown			= input.keyboard.keyDown;
		window.onkeyup				= input.keyboard.keyUp;

		//gh.hud.setupInput();

		return true;
	};

	/**
	 * @method buildImageData
	 */
	gh.buildImageData = function(){
		if(graphics.getLoaded() > 0){
			requestAnimationFrame(gh.buildImageData);
		} else {
			for(var key in gh.assets.sprites){
				gh.assets.sprites[key].buildImageData();
			}

			gh.run();
		}
	};

	/**
	 * @method start
	 * @return
	 */
	gh.run = function(){

		if(true){
			gh.ptrGameState = gh[gh.ptrGameState].update();
			if(gh.ptrActiveLevel.manager.getActivePlayer().getActiveAgent().active){
				gh[gh.ptrGameState].render();
			}

			requestAnimationFrame(gh.run);
		}

		return true;
	};

	return gh;
})(gh || {});