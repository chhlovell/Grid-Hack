"use strict"

var gh = (function(gh){
	console.log("trap.js loaded");

	var trap = (function(trap){

		trap.arrow = function(target, damage){
			target.damageHealth(damage);
			return;
		};

		trap.pit = function(target, damage){
			target.damageHealth(damage);
			return;
		}

		return trap;
	})(trap || {});


	gh.trap = trap;

	return gh;
})(gh || {});