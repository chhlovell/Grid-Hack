"use strict"

var gh = (function(gh){
	console.log("object.js loaded");

	function Gold(value){
		this.value = value || 0;
		this.img = "";
	}

	function Gem(value){
		this.value = value || 0;
		this.img = "";
	}

	function Jewel(value){
		this.value = value || 0;
		this.img = "";
	}

	function Potion(name, onUse){
		this.name = name;
		this.onUse = onUse;
		this.img = "";
	}
	
	gh.Gold 		= Gold;
	gh.Gem 			= Gem;
	gh.Jewel		= Jewel;
	gh.Potion 		= Potion;

	return gh;
})(gh || {});