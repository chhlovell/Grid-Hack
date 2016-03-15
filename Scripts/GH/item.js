/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("item.js loaded");

	/**
	 * @class Item
	 */
	function Item(name, uniqueID, templateRef, spriteID, mask, x, y, rotation){
		this.name = name;
		this.uniqueID = uniqueID;
		this.templateRef = templateRef;
		this.spriteID = spriteID;
		this.mask = mask;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
	}

	gh.Item = Item;

	return gh;
})(gh || {});