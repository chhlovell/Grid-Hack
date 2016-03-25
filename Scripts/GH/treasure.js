"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("treasure.js loaded");

	/**
	 * @class Card
	 * @constructor
	 * @param {string} name The descriptive name of the treasure card event.
	 * @param {string} description The descriptive text of the treasure card event.
	 * @param {} attribute A key and value object containing the relevant data for extrapolating what the card functionally does.
	 */
	function Card(name, description, attribute, image){
		this.name 				= name;
		this.description 		= description;
		this.attribute 			= attribute;
		this.image				= image;
	}

	/**
	 * @class Treasure
	 * @constructor
	 * @param {[gh.Card]} cards A deck of cards which determine the treasure found on searching.
	 * @parma {string} wanderingMonster A resRef to the wandering monster whic appears when the referred to event occurs.
	 */
	function Treasure(cards, wanderingMonster){
		this.deck 				= cards || [];
		this.wanderingMonster   = wanderingMonster;
	}

	/**
	 * This method reutrns a random card from the deck. The card is removed from the pool in the process.
	 * @ method getCard
	 */
	Treasure.prototype.getCard = function(){
		var length = this.deck.length;

		if(length <= 0){
			return null;
		}

		var r = Math.floor(Math.random() * length);
		var card = this.deck.splice(r, 1)[0];

		return card;
	};

	gh.Card 		= Card;
	gh.Treasure 	= Treasure;

	return gh;
})(gh || {});