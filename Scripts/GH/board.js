"use strict"

/**
 * @module gh
 */

/**
 * The board class is responsible for drawing all aspects of the game state with exception of the user
 * interface which is the perview of the hud.
 * @class gh
 * @param {} gh The Grid Hack namespace
 * @return
 */
var gh = (function(gh){
	console.log("board.js loaded");

	/**
	 * @class Board
	 * @constructor
	 * @param {string} canvasId
	 * @param {integer} width
	 * @param {integer} height
	 * @return
	 */
	function Board(canvasId, width, height){
		this.canvas2d 	= new graphics.Canvas2D(canvasId, "0px", "0px", width, height);
		this.scale		= .8;
		this.tileSize	= 64;
		this.offset 	= {	"x" : 0, "y" : 0 };
	}

	Board.prototype.handleInput = function(){
		var key = input.keyboard.key;

		if(key[input.keyboard.PLUS] && key[input.keyboard.PLUS].pressed){
			gh.board.scale += 0.05;
		}
		if(key[input.keyboard.MINUS] && key[input.keyboard.MINUS].pressed){
			gh.board.scale -= 0.05;
			if(gh.board.scale < 0.2){
				gh.board.scale = 0.2;
			}
		}

		if(key[input.keyboard.LEFT] && key[input.keyboard.LEFT].pressed){
			this.offset.x -= 5;
		}
		if(key[input.keyboard.RIGHT] && key[input.keyboard.RIGHT].pressed){
			this.offset.x += 5;
		}
		if(key[input.keyboard.UP] && key[input.keyboard.UP].pressed){
			this.offset.y -= 5;
		}
		if(key[input.keyboard.DOWN] && key[input.keyboard.DOWN].pressed){
			this.offset.y += 5;
		}

	};

	Board.prototype.mouseToCell = function(){
		var x = Math.floor((input.mouse.x - this.offset.x) / (this.tileSize * this.scale));
		var y = Math.floor((input.mouse.y - this.offset.y) / (this.tileSize * this.scale));

		return new math.Vec2(x, y);
	};

	/**
	 * Draw the board to the canvas.  The drawing order is as follows:
	 * 1) the floor tiles
	 * 2) the borders (walls, doors, etc)
	 * 3) items and other objects
	 * 4) agents
	 * 5) other visual effects
	 * Note that triggers can change what is to be drawn at any level by changing the sate of a
	 * particular object.
	 * @method draw
	 * @param {string} team The team which is viewing the board.
	 * @return
	 */
	Board.prototype.draw = function(team){
		var canvas = this.canvas2d.canvas;
		var context = this.canvas2d.context;

		context.save();

		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

		context.restore();

		gh.ptrActiveLevel.mapData.map.drawFloor(context, this.tileSize, this.scale, this.offset, team);
		gh.ptrActiveLevel.mapData.map.drawBorders(context, this.tileSize, this.scale, this.offset, team);
		
		gh.ptrActiveLevel.mapData.map.drawItems(context, this.tileSize, this.scale, this.offset, team);
		
		gh.ptrActiveLevel.mapData.map.drawAgents(context, this.tileSize, this.scale, this.offset, team);
		gh.ptrActiveLevel.drawTriggers(context, this.tileSize, this.scale, this.offset, team);


		return true;
	};

	/**
	 * @method centerOn
	 */
	Board.prototype.centerOn = function(obj){
		var posx = obj.x * this.tileSize * this.scale;
		var posy = obj.y * this.tileSize * this.scale;
		this.offset.x = 0 - posx + (this.canvas2d.canvas.width * 0.5) - (this.tileSize * this.scale * 0.5);
		this.offset.y = 0 - posy + (this.canvas2d.canvas.height * 0.5) - (this.tileSize * this.scale * 0.5);
	}

	gh.Board = Board;

	return gh;
})(gh || {});