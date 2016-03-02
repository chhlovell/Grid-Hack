"use strict"

/** 
 * @module gh
 */

var gh = (function(gh){
	console.log("campaign.js loaded");

	/**
	 * @class Campaign
	 * @constructor
	 * @param {string} name
	 * @param {string} introText
	 * @param {[Level]} levels
	 */
	function Campaign(name, introText, levels){
		this.name 				= name || "";
		this.introText 			= introText || "";
		this.levels 			= levels || [];
		this.ptrActiveLevel 	= this.levels[0];
	}

	gh.Campaign = Campaign;
	return gh;
})(gh || {});