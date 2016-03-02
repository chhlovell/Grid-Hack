"use strict"

/** 
 * @module gh
 */

/** 
 * @class gh
 */
var gh = (function(gh){

	console.log("assets.js loaded");

	var assets = (function(assets){
		assets.sprites = {};
	
		return assets;
	})(assets || {});

	gh.assets = assets;

	return gh;
})(gh || {});