"use strict"

var gh = (function(gh){
	console.log("stateLevelIntro loaded");

	var stateLevelIntro = (function(stateLevelIntro){

		var LI_LEVEL_INTRO	= document.getElementById("levelIntro");
		var LI_TITLE		= document.getElementById("liTitle");
		var LI_TEXT			= document.getElementById("liText");
		var LI_CONTINUE		= document.getElementById("liContinue");

		var _state 			= "stateLevelIntro"

		stateLevelIntro.setup = function(){
			LI_CONTINUE.onclick 	= gh.stateLevelIntro.onContinue;
			LI_TITLE.innerHTML 		= gh.ptrActiveLevel.name;
			LI_TEXT.innerHTML 		= gh.ptrActiveLevel.introText;
		};

		stateLevelIntro.update = function(){
			return _state;
		};

		stateLevelIntro.render = function(){

		};

		stateLevelIntro.onContinue = function(){
			stdlib.dom.setNodeTreeStyle(LI_LEVEL_INTRO, "visibility", "hidden");
			_state = "stateSetup";
		};

		return stateLevelIntro;
	})(stateLevelIntro || {});

	gh.stateLevelIntro = stateLevelIntro;

	return gh;
})(gh || {});