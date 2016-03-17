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
	 */
	function Item(name, uniqueID, templateRef, description, spriteID, x, y, width, height, rotation, obstacle, usable){
		this.name 				= name || "defaultName";
		this.uniqueID 			= uniqueID || "uniqueID";
		this.templateRef 		= templateRef || "templateRef";
		this.description		= description || "This is an item";
		this.spriteID 			= spriteID;
		this.mask 				= mask || [];
		this.x 					= x;
		this.y 					= y;
		this.rotation 			= rotation || 0;
		this.obstacle			= obstacle || true;
		this.usable				= usable || false;
	}

	/**
	 * Draw the item to the given canvas.
	 * @method draw
	 * @param {Canvas.context} context
	 */
	Item.prototype.draw = function(context){

	};

	gh.Item = Item;

	return gh;
})(gh || {});