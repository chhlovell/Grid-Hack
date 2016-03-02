"use strict"

var stdlib = (function(stdlib){
	console.log("stdlib.js loaded");

	stdlib.isString = function(obj){
		if(typeof obj === "string" || obj instanceof String){
			return true;
		}

		return false;
	}

	return stdlib;
})(stdlib || {});