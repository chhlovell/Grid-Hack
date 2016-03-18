"use strict"

/**
 * @module gh
 */


/**
 * @class gh
 */
var gh = (function(gh){

	console.log("json.js loaded");

	/**
	 * @class json
	 */
	var json = (function(json){

		/**
		 * Private globals
		 */
		var PATH = "./Data/Campaigns/";

		/**
		 * @method loadCampaign
		 * @param {string} name The name of the current campaign
		 */
		json.loadCampaign = function(name){
			var path = PATH + name + "/Data/" + name + ".json";
			var jsonData = json.getData(path);
			var jsonAgentTemplates = json.getData(PATH + name + "/Data/creatures.json");
			var jsonWeaponTemplates = json.getData(PATH + name + "/Data/weapons.json");
			var jsonItemTemplates = json.getData(PATH + name + "/Data/items.json");

			var levels = [];
			for(var it = 0; it < jsonData.levels.length; it++){
				if(jsonData.levels[it]){
					levels.push(json.loadLevel(name, jsonData.levels[it], jsonAgentTemplates, jsonWeaponTemplates, jsonItemTemplates));
				}
			}

			var campaign = new gh.Campaign(
				jsonData.name,
				jsonData.introText,
				levels
			);

			return campaign;
		};

		/**
		 * @method getData
		 * @param {string} path
		 * @return
		 */
		json.getData = function(path){
			var data = getAJAX(path);
			data = JSON.parse(data);

			return data;
		}

		/**
		 * @method loadLevel
		 * @param {string} campaignName
		 * @param {string} levelName
		 * @param {JSON} jsonAgentTemplates
		 */
		json.loadLevel = function(campaignName, levelName, jsonAgentTemplates, jsonWeaponTemplates, jsonItemTemplates){
			var path = PATH + campaignName + "/Data/" + levelName + ".json";
			var jsonData = getAJAX(path);
			jsonData = JSON.parse(jsonData);

			var players = json.getPlayers(jsonData.players, jsonAgentTemplates, jsonWeaponTemplates);

			var level = new gh.Level(
				jsonData.name,
				jsonData.introText,
				jsonData.numHeroes,
				json.getAvailableHeroes(jsonData.availableHeroes), // availableHeroes
				players, // players
				jsonData.teams, // teams
				json.getMapData(jsonData.mapData, players, jsonItemTemplates)  // mapData
			);
			
			return level;
		};

		/**
		 * @method getHeroes
		 * @param {[string]} jsonData An array of available hero template IDs.
		 * @return
		 */
		json.getAvailableHeroes = function(jsonAvailableHeroes){
			var availableHeroes = [];

			for(var it = 0; it < jsonAvailableHeroes.length; it++){
				availableHeroes.push(jsonAvailableHeroes[it]);
			}

			return availableHeroes;
		};

		/**
		 * @method getPlayers
		 * @param {[gh.Player]} jsonPlayers
		 * @param {JSON} jsonAgentTemplates
		 * @return
		 */
		json.getPlayers = function(jsonPlayers, jsonAgentTemplates, jsonWeaponTemplates){
			var players = [];
			var AI;

			if(jsonPlayers){
				for(var it = 0; it < jsonPlayers.length; it++){
					if(jsonPlayers[it].AI === true){
						AI = gh.AI.COMPUTER;
					} else {
						AI = gh.AI.HUMAN;
					}
					players.push(
						new gh.Player(
							jsonPlayers[it].name,
							AI,
							json.getRoster(jsonPlayers[it].roster, jsonAgentTemplates, jsonWeaponTemplates)
						)
					);
				}
			}

			return players;
		};

		/**
		 * @method getWeapon
		 * @param {string} resRef
		 * @param {JSON} jsonWeaponTemplates
		 */
		json.getWeapon = function(resRef, jsonWeaponTemplates){
			var template = jsonWeaponTemplates[resRef];

			return new gh.Weapon(
				template.name,
				resRef,
				template.size,
				template.attack,
				template.hands,
				template.range,
				template.diagonal,
				template.cost,
				template.actionPoints
			);
		}

		/**
		 * @method getRoster
		 * @param {[gh.Agent]} jsonRoster
		 * @param {JSON} jsonAgentTemplates
		 * @param {JSON} jsonWeaponTemplates
		 * @return
		 */
		json.getRoster = function(jsonRoster, jsonAgentTemplates, jsonWeaponTemplates){
			var roster = [];

			for(var it = 0; it < jsonRoster.length; it++){
				var template = jsonAgentTemplates[jsonRoster[it].name];
				var weaponResRef;
				if(jsonRoster[it].mainHand){
					weaponResRef = jsonRoser[it].mainHand;
				} else {
					weaponResRef = template.mainHand;
				}
				var weapon = json.getWeapon(weaponResRef, jsonWeaponTemplates);

				roster.push(
					new gh.Agent(
						jsonRoster[it].name,
						jsonRoster[it].id,
						jsonRoster[it].position.x,
						jsonRoster[it].position.y,
						null, // ptrOwner
						jsonRoster[it].faction,
						template.description,
						template.body,
						template.mind,
						template.baseDefence,
						weapon,
						template.offHand,
						template.chest,
						template.head,
						template.moveDice,
						template.baseMove,
						template.spellList,
						template.inventory,
						template.sprites,
						template.animations
					)
				);
			}
			return roster;
		};

		/**
		 * This method builds the digital map data for a particular campaign level.
		 * The map data consists of a board, which is a 2d array of cells.  The cells
		 * contain all the relevant information about its content, including pointers to
		 * items, agents and trigger objects located on any particular cell.
		 * @method getMapData
		 * @param {JSON} jsonMapData
		 * @param {[gh.Player]} players
		 * @return
		 */
		json.getMapData = function(jsonMapData, players, jsonItemTemplates){
			var mapData 		= {};
			var board 			= [];
			var map 			= jsonMapData.map;
			var triggers 		= jsonMapData.triggers;
			var items 			= jsonMapData.items;

			mapData.triggers	= json.getTriggers(triggers);
			mapData.items		= json.getItems(items, jsonItemTemplates);

			console.log(mapData.items);

			// Get the raw cell data
			if(map !== undefined){
				for(var y = 0; y < map.length; y++){
					board.push([]);
					board[y] = [];
					for(var x = 0; x < map[y].length; x++){
						var cell = new gh.Cell(
							x, y,
							json.getBorder(x, y, map[y][x]),
							json.getAgentsAt(players, x, y), // agents
							gh.getItemsAt(mapData.items, x, y), // items
							json.findTriggers(x, y, mapData.triggers), // triggers
							map[y][x].visible, // visibility
							map[y][x].img,  // spriteId
							map[y][x].rotation
						);
						board[y].push(cell);
					}
				}
			}

			json.fillBorders(board);

			mapData.map = new gh.Map(board);

			// Add item data
			// Add trigger data

			return mapData;
		};

		/**
		 * This method parses through a list of player's rosters and returns a list of all those
		 * agents determined to be at a given (x,y) location on the board. 
		 * @method getAgentsAt
		 * @param {[gh.Player]} players
		 * @param {integer} x
		 * @param {integer} y
		 */
		json.getAgentsAt = function(players, x, y){
			var agents = [];

			for(var it = 0; it < players.length; it++){
				for(var n = 0; n < players[it].roster.length; n++){
					if(players[it].roster[n].x === x && players[it].roster[n].y === y){
						agents.push(players[it].roster[n]);
					}
				}
			}

			return agents;
		}

		/**
		 * @method getTriggers
		 * @param {JSON} jsonTriggers
		 */
		json.getTriggers = function(jsonTriggers){
			var triggers = [];

			for(var it = 0; it < jsonTriggers.length; it++){
				switch(jsonTriggers[it].type){
					case "entry":
						triggers.push(new gh.EntryTrigger(jsonTriggers[it].pos.x, jsonTriggers[it].pos.y));
						break;
					case "exit":
						break;
					default:
						break;
				}
			}

			return triggers;
		}

		/**
		 * @method findTrigger
		 * @param {integer} x
		 * @param {integer} y
		 * @return
		 */
		json.findTriggers = function(x, y, triggers){
			var trig = [];

			for(var it = 0; it < triggers.length; it++){
				if(triggers[it].x === x && triggers[it].y === y){
					trig.push(triggers[it]);
				}
			}

			return trig;
		};

		/**
		 * Given a list of JSON items create a list of items for the mapData data structure.
		 * @method getItems
		 * @param {JSON} items
		 * @return
		 */
		json.getItems = function(items, jsonItemTemplates){
			if(!items){
				return [];
			}
			var itemList = [];
			for(var it = 0; it < items.length; it++){
				var ptrItem = jsonItemTemplates[items[it].type];
				console.log(ptrItem);
				itemList.push(new gh.Item(
					ptrItem.name,
					items[it].id,
					items[it].type,
					ptrItem.description,
					ptrItem.sprite,
					items[it].pos.x,
					items[it].pos.y,
					ptrItem.width,
					ptrItem.height,
					items[it].rotation,
					ptrItem.obstacle,
					ptrItem.usable
					)
				);
			}

			return itemList;
		};

		/**
		 * @method getBorder
		 * @param {integer} x
		 * @param {integer} y
		 * @param {} jsonCell
		 */
		json.getBorder = function(x, y, jsonCell){
			var cell = jsonCell;
			var border = {};
			if(cell.border){
				if(cell.border.wall){
					for(var it = 0; it < cell.border.wall.length; it++){
						border[cell.border.wall[it]] = new gh.Wall(x, y, cell.border.wall[it], false, false);
					}
				} else if(cell.border.door){
					for(var key in cell.border.door){
						var door = cell.border.door[key];
						border[key] = new gh.Door(
							x,
							y,
							key, 
							door.open, 
							{
								"open" 					: "openDoor.gif",
								"closed" 				: "closedDoor.png",
								"openDoorHighlight" 	: "openDoorHighlight.gif",
								"closedHighlight" 		: "closedDoorHighlight.gif"
							}
						);
					}
				}
			}

			return border;
		};

		/**
		 * @method fillBorders
		 * @param {} map
		 */
		json.fillBorders = function(map){
			for(var y = 0; y < map.length; y++){
				for(var x = 0; x < map[y].length; x++){
					if(map[y][x].border){
						if(y > 0){
							if(map[y][x].border.top){
								map[y-1][x].border.bottom = map[y][x].border.top;
							}
						}
						if(x > 0){
							if(map[y][x].border.left){
								map[y][x-1].border.right = map[y][x].border.left;
							}
						}
					}
				}
			}
		};

		/** 
		 * @method loadAssets
		 * @param {} assets
		 * @param {string} campaignName
		 * @param {string} levelName
		 * @return
		 */
		json.loadAssets = function(assets, campaignName, levelName){
			var path = PATH + campaignName + "/Data/" + levelName + ".json";
			var data = json.getData(path);
			var map = data.mapData.map;
			var agents = json.getData(PATH + campaignName + "/Data/creatures.json");
			var items = json.getData(PATH + campaignName + "/Data/items.json");

			json.getMapSpriteList(PATH + campaignName + "/Graphics/", map, gh.assets.sprites);
			json.getBorderSprites(PATH + campaignName + "/Graphics/Border/", data.stdGraphics, gh.assets.sprites);
			json.getAgentSprites(PATH + campaignName + "/Graphics/Creatures/", agents, gh.assets.sprites);
			json.getItemSprites(PATH + campaignName + "/Graphics/Items/", items, gh.assets.sprites);

			return true;
		};

		/**
		 * @method getMapSpriteList
		 * @param {string} path
		 * @param {JSON} jsonMap
		 * @param {} sprites
		 * @return
		 */
		json.getMapSpriteList = function(path, jsonMap, sprites){
			for(var y = 0; y < jsonMap.length; y++){
				for(var x = 0; x < jsonMap[y].length; x++){
					if(jsonMap[y][x].img){
						if(sprites[jsonMap[y][x].img] === undefined){
							sprites[jsonMap[y][x].img] = new graphics.Sprite(path + "Floor Tiles/" + jsonMap[y][x].img);
						}
					}
				}
			}

			return true;
		}

		/**
		 * @method getBorderSprites
		 * @param {string} path The folder in which the border sprites are located.
		 * @param {JSON} jsonBorderSprites The JSON data which includes the border sprite information.
		 * @param {gh.assets.sprites} sprites The asset sprite object which is to be updated with the new sprites.
		 * @return
		 */
		json.getBorderSprites = function(path, jsonBorderSprites, sprites){
			var doorSprites = jsonBorderSprites.door;
			for(var key in doorSprites){
				sprites[doorSprites[key]] = new graphics.Sprite(path + doorSprites[key]);
			}

			return true;
		};

		/**
		 * @method getAgentSprites
		 */
		json.getAgentSprites = function(path, jsonAgentTemplates, sprites){
			for(var key in jsonAgentTemplates){
				// load the animations
				if(jsonAgentTemplates[key].animations){
					for(var animation in jsonAgentTemplates[key].animations){
						var sprite = jsonAgentTemplates[key].animations[animation].path;
						sprites[sprite] = sprites[sprite] || new graphics.SpriteStrip(
							path+sprite,
							jsonAgentTemplates[key].animations[animation].numFrames,
							jsonAgentTemplates[key].animations[animation].frameWidth,
							jsonAgentTemplates[key].animations[animation].index
						);
					}
				}

				// loas static display sprites
				if(jsonAgentTemplates[key].sprites){
					sprites[jsonAgentTemplates[key].sprites.display] = new graphics.Sprite(path+jsonAgentTemplates[key].sprites.display);
				}
			}
			return true;
		}

		/**
		 * This method loads the item sprites into the gh.assets.sprites list.
		 * @method getItemSprites
		 * @parma {string} path
		 * @param {JSON} jsonItemTemplates
		 * @param {gh.assets.sprites} sprites
		 */
		json.getItemSprites = function(path, jsonItemTemplates, sprites){
			for(var key in jsonItemTemplates){
				if(jsonItemTemplates[key].sprite){
					sprites[jsonItemTemplates[key].sprite] = new graphics.Sprite(path + jsonItemTemplates[key].sprite);
				}
			}
		};

		return json;
	})(json || {});

	gh.json = json;
	return gh;
})(gh || {});