/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("item.js loaded");

	/**
	 * Items are cosmetic features on a board which a player might potentially interract with.
	 * Items are 2 dimensional constructs with a width and height, with the x,y coordinate indicating
	 * the upper left coordinate of the item on the board.  Each board cell has an item queue,
	 * each element of which is a pointer to the Item object.  Thus multiple cells may point to a
	 * single Item.
	 *
	 * It is expected in future to add a 'mask' parameter which indicates which parts of the 2
	 * dimensional space are actually taken up by the item.  This will allow for irregularly shaped
	 * items in design.
	 * @class Item
	 * @param {string} name The descriptive name of this item.
	 * @param {string} uniqueID The unique identifier of this Item.
	 * @param {string} templateRef The reference string of the Item in the Item template file.
	 * @param {string} description A description of the item.
	 * @param {string} spriteID The identifier of the items display sprite in the sprite data set.
	 * @param {integer} x The x coordinate of the upper left corner of the Item on the board.
	 * @param {integer} y The y coordinate of the upper left corner of the Item on the board.
	 * @param {integer} width The width of the item (cells) on the board.
	 * @param {integer} height The height of the item (cells) on the board.
	 * @param {integer} rotation The rotation of the object in degrees.
	 * @param {bool} obstacle Identifies whether or not the item is an obstacle for the purposes of agent movement.
	 * @param {bool} usable Identifies whether or not an agent can interract with the item.
	 * @param {} mask
	 */
	function Item(name, uniqueID, templateRef, description, spriteID, x, y, width, height, rotation, obstacle, usable, inventory, mask){
		this.name 				= name || "defaultName";
		this.uniqueID 			= uniqueID || "uniqueID";
		this.templateRef 		= templateRef || "templateRef";
		this.description		= description || "This is an item";
		this.spriteID 			= spriteID;
		this.mask 				= mask || [];
		this.x 					= x;
		this.y 					= y;
		this.width				= width;
		this.height				= height;
		this.rotation 			= rotation || 0;
		this.obstacle			= obstacle || false;
		this.usable				= usable || false;
		this.inventory 			= inventory || [];

		// By default all items that are not explicitly empty of content should contain one
		// random search treasure item which is sourced from the level treasure deck.
		if(this.inventory.length === 0){
			this.inventory.push({"fn" : "random"});
		}

		// This.searched is likely to become redundant.
		this.searched			= []; 	// This is a list of all agents which have already search the item.
										// An agent is added to the list the first time it is searched.
										// An agent in the list may not search the item again.
	}

	/**
	 * Draw the item to the given canvas.  Rotation is allowed for, rotaton not around the
	 * center of an image, preserves the upper left corner of the item on the map.
	 * @method draw
	 * @param {Canvas.context} context
	 */
	Item.prototype.draw = function(context, tileSize, scale, offset, team){
		var s = gh.assets.sprites[this.spriteID];

		// Get the grid coordinate to rotate around.
		var ax = this.x;
		var ay = this.y;
		switch(this.rotation){
			case 90:
				ax += this.height;
				break;
			case 180:
				ax += this.width;
				ay += this.height;
				break;
			case 270:
				ay += this.width;
				break;
			default:
				break;
		}

		context.save();

		context.translate(ax * scale * tileSize + offset.x, ay * scale * tileSize + offset.y);
		context.rotate(math.degToRadians(this.rotation));

		context.drawImage(
			s.img,
			0,
			0,
			s.img.width,
			s.img.height,
			0,
			0,
			tileSize * scale * this.width,
			tileSize * scale * this.height
		);

		context.restore();

	};

	/**
	 * Determine whether or not an item in a cell has been clicked.
	 * This method accounts for items with width and height dimensions greater than 1.
	 * @method isClicked
	 * @param {integer} cellx
	 * @param {integer} celly
	 * @param {integer} mouseX
	 * @param {integer} mouseY
	 * @parma {float} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {} sprites
	 * @return
	 */
	Item.prototype.isClicked = function(cellx, celly, mouseX, mouseY, tileSize, scale, offset, sprites){
		var x = 0, y = 0;

		// Get the location of the cell with respect to the Item's upper left corner.
		var dx = Math.abs(cellx - this.x);
		var dy = Math.abs(celly - this.y);

		// Get the relative coordiante of the mouse within the clicked cell.
		var cx = ((mouseX - offset.x) - (cellx * tileSize * scale)) / scale;
		var cy = ((mouseY - offset.y) - (celly * tileSize * scale)) / scale;


		// Get the location of the mouse with respect to the entire Item, accounting for
		// rotation and the width/height of the item.
		switch(this.rotation){
			case 0:
				var ix = (dx * tileSize) + cx;
				var iy = (dy * tileSize) + cy;
				break;
			case 90:
				var ix = (dy * tileSize) + cy;
				var iy = ((this.x + this.height - cellx - 1) * tileSize) + (tileSize - cx);
				break;
			case 180:
				var ix = ((this.x + this.width - cellx - 1) * tileSize) + (tileSize - cx);
				var iy = ((this.y + this.height - celly - 1) * tileSize) + (tileSize - cy);
				break;
			case 270:
				var ix = (Math.abs((this.y + this.width) - celly -1) * tileSize) + (tileSize - cy);
				var iy = (dx * tileSize) + (cx);
				break;
		}

		// Get the ratio of the image display on the board to the actual image size.
		var ratiox = (this.width * tileSize) / gh.assets.sprites[this.spriteID].img.width;
		var ratioy = (this.height * tileSize) / gh.assets.sprites[this.spriteID].img.height;

		// Get the actual image coordinates
		x = Math.round(ix/ratiox);
		y = Math.round(iy/ratioy);

		var pixel = sprites[this.spriteID].getPixelColor(x, y);
		//console.log(pixel);

		return !pixel.isTransparent();
	};

	/**
	 * This method determines if an item is in reach of an agent.
	 * @method canReach
	 * @param {gh.Agent} agent The agent trying to reach the item.
	 * @return
	 */
	Item.prototype.canReach = function(agent){
		if(this.rotation === 90 || this.rotation === 270){
			for(var y = 0; y < this.width; y++){
				for(var x = 0; x < this.height; x++){
					if(gh.getMapDist(this.x + x, this.y + y, agent.x, agent.y) <= 1){
						return true;
					}
				}
			}
		} else {
			for(var y = 0; y < this.height; y++){
				for(var x = 0; x < this.width; x++){
					if(gh.getMapDist(this.x + x, this.y + y, agent.x, agent.y) <= 1){
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * @method hasSearched
	 * @param {gh.Agent} agent
	 */
	Item.prototype.hasSearched = function(agent){
		for(var it = 0; it < this.searched.length; it++){
			if(agent === this.searched[it]) return true;
		}

		return false;
	};

	/**
	 * @method onSearch
	 * @param {gh.Agent} agent
	 */
	Item.prototype.onSearch = function(agent){
		if(!this.canReach(agent)) return false;
		if(agent.actions.used()) return false;

		agent.actions.search++;
		this.searched.push(agent);

		// If the item has nothign in its inventory list generate
		// an 'empty' treasure card event.
		if(this.inventory.length <= 0){
			gh.stateTreasure.load(new gh.Card("Empty", "You fail to find anything of value.", "", ""));
			return true;
		} 
		//if(this.hasSearched(agent))	return false;

		// While the Item has contents, the hero reveals the content.
		for(var it = 0; it < this.inventory.length;){
			switch (this.inventory[it].fn){

				// The item is specifically empty.
				// Generate an appropriate 'empty' treasure card for the event.
				case "empty":
					gh.stateTreasure.load(new gh.Card("Empty", "You fail to find anything of value.", "", ""));
					break;

				// The item contains a specific treasure item.
				// Generate a treasure card/cards for those items and display them via
				// the stateTreasure screen.
				case "treasure":
					var treasure = new gh.Card(
						this.inventory[it].args.name,
						this.inventory[it].args.description,
						this.inventory[it].args.function,
						this.inventory[it].args.image
					);
					gh.stateTreasure.load(treasure);
					treasure.onFind(agent);
					break;

				// The item contains a random tresure.
				// Generate a random treasure from the level treasure deck.
				case "random":
					var treasure = gh.ptrActiveLevel.treasure.getCard();
					gh.stateTreasure.load(treasure);
					treasure.onFind(agent);
					break;

				case "trap":
					var treasure = new gh.Card(
						this.inventory[it].args.name,
						this.inventory[it].args.description,
						this.inventory[it].args.function,
						this.inventory[it].args.image
					);
					gh.stateTreasure.load(treasure);
					treasure.onFind(agent);
					break;
				default:
					break;
			}
			this.inventory.shift(0, 1);
		}


		return true;
	};

	gh.Item = Item;

	/**
	 * This method returns a list of items in a item list that are located at a
	 * particular (x,y) position on the board.
	 * @method getItemsAt
	 * @param {[gh.Item]} items
	 * @param {integer} x
	 * @param {integer} y
	 * @return
	 */
	gh.getItemsAt = function(items, x, y){
		var iList = [];

		if(!items){
			return iList;
		}

		for(var it = 0; it < items.length; it++){
			for(var yit = 0; yit < items[it].height; yit++){
				for(var xit = 0; xit < items[it].width; xit++){

					if(items[it].rotation === 90 || items[it].rotation === 270){
						if((items[it].x + yit) === x && (items[it].y + xit) === y){
							iList.push(items[it]);
						}
					} else {
						if((items[it].x + xit) === x && (items[it].y + yit) === y){
							iList.push(items[it]);
						}
					}

				}
			}
		}

		return iList;
	};

	return gh;
})(gh || {});