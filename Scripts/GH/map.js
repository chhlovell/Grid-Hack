"use strict"

/**
 * @module gh
 */

/**
 * @class gh
 */
var gh = (function(gh){
	console.log("map.js loaded");

	/**
	 * @method getMapDist
	 * @param {integer} x1
	 * @param {integer} y1
	 * @param {integer} x2
	 * @param {integer} y2
	 */
	gh.getMapDist = function(x1, y1, x2, y2){
		return Math.abs(x2 - x1) + Math.abs(y2 - y1);
	};

	gh.isDiagonal = function(x1, y1, x2, y2){
		if((gh.getMapDist(x1, y1, x2, y1) === 1) && (gh.getMapDist(x1, y1, x1, y2) === 1)){
			return true;
		}

		return false;
	};

	/**
	 * @class Map
	 * @constructor
	 */
	function Map(board){
		this.board = board;
	}

	/**
	 * @method drawFloor
	 * @param {Canvas.context} context
	 * @param {integer} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {string} team
	 * @return
	 */
	Map.prototype.drawFloor = function(context, tileSize, scale, offset, team){
		for(var y = 0; y < this.board.length; y++){
			for(var x = 0; x < this.board[y].length; x++){
				this.board[y][x].drawFloor(context, tileSize, scale, offset, team);
			}
		}
		return true;
	};

	/**
	 * @method drawBorders
	 * @param {Canvas.context} context
	 * @param {integer} tileSize
	 * @param {float} scale
	 * @param {} offset
	 * @param {string} team
	 * @return
	 */
	Map.prototype.drawBorders = function(context, tileSize, scale, offset, team){
		for(var y = 0; y < this.board.length; y++){
			for(var x =0; x < this.board[y].length; x++){
				this.board[y][x].drawBorders(context, tileSize, scale, offset, team);
			}
		}
		return true;
	};

	/**
	 * @method drawItems
	 * @param {} context
	 * @return 
	 */
	Map.prototype.drawItems = function(context, tileSize, scale, offset, team){
		for(var y = 0; y < this.board.length; y++){
			for(var x = 0; x < this.board[y].length; x++){
				this.board[y][x].drawItems(context, tileSize, scale, offset, team);
			}
		}
		return true;
	};

	/**
	 * @method drawAgents
	 * @param {} context
	 * @return
	 */
	Map.prototype.drawAgents = function(context, tileSize, scale, offset, team){
		for(var y = 0; y < this.board.length; y++){
			for(var x = 0; x < this.board[y].length; x++){
				this.board[y][x].drawAgents(context, tileSize, scale, offset, team);
			}
		}
		return true;
	};

	/**
	 * @method drawTriggers
	 * @param {} context
	 * @return
	 */
	Map.prototype.drawTriggers = function(context){
		console.log(this);

		return true;
	};

	/**
	 * Set the map visibility for all cells to the given visibility for all factions.
	 * @method clearVisibility
	 * @param {bool} visibility
	 * @return
	 */
	Map.prototype.clearVisibility = function(visibility){
		for(var y = 0; y < this.board.length; y++){
			for(var x = 0; x < this.board[y].length; x++){
				this.board[y][x].visible = this.board[y][x].visible || {};
				for(var key in this.board[y][x].visibile){
					this.board[y][x].visible[key] = visibility;
				}
			}
		}
	};

	/**
	 * @method updateAgentVisibility
	 * @parma {gh.Agent} agent
	 */
	Map.prototype.updateAgentVisibility = function(agent){
		for(var y = 0; y < this.board.length; y++){
			for(var x = 0; x < this.board[y].length;){
				var ray = this.getLine(agent.x, agent.y, x, y);
				this.setRayVisibility(ray, agent.team, true);

				if(y === 0 || y === this.board.length-1){
					x++;
				} else {
					if(x === 0){
						x = this.board[y].length-1;	
					} else {
						x = this.board[y].length;								
					}
				}
			}
		}
	};

	/**
	 * @method setRayVisibility
	 * @param {} ray
	 * @param {string} faction
	 * @param {bool} visibility
	 * @return
	 */
	Map.prototype.setRayVisibility = function(ray, faction, visibility){
		for(var it = 0; it < ray.length; it++){
			ray[it].visible[faction] = visibility;

			// Set the visible agents to 'active' regardless of faction orientation.
			if(ray[it].agents){
				for(var n = 0; n < ray[it].agents.length; n++){
					ray[it].agents[n].active = true;
				}
			}

			var next = ray[it+1];
			if(next){
				var border;

				if(next.x > ray[it].x){
					// check right
					border = ray[it].border.right;
				} else if(next.x < ray[it].x){
					// check left
					border = ray[it].border.left;
				} else if(next.y < ray[it].y){
					// check top
					border = ray[it].border.top;
				} else {
					// check bottom
					border = ray[it].border.bottom;
				}

				if(border){
					if(border instanceof gh.Wall && border.passable === false){
						return;
					} else if (border instanceof gh.Door && border.open === false){
						return;
					}
				}
			}
		}
	};

	/**
	 * @method getLine
	 * @param {integer} x0
	 * @param {integer} y0
	 * @param {integer} x1
	 * @param {integer} y1
	 * @return
	 */
	Map.prototype.getLine = function(x0, y0, x1, y1){
		var dy 			= y1-y0;						// change in y
		var dx 			= x1-x0;						// change in x
		var m 			= dy/dx;						// slope
		var itx;										// x-axis direction iterator
		var ity;										// y-axis direction iterator
		var x, y;										// for loop iterators per x and y axes
		var b			= (y0+0.5)-(m*(x0+0.5));		// y-axis intercept
		var yint;										// y-intercept
		var blocked 	= false;						// indicates whether line to object is obstructed

		var path 		= [];

		if(x0 === x1 && y0 === y1){
			return path;
		}

		// Get the direction of the line.
		x1 < x0 ? itx = -1 : itx = 1;
		y1 < y0 ? ity = -1 : ity = 1;

		if(dx == 0){ // vertical line
			var ylim = y1;	// The y-axis constraint.
			y1 > y0 ? ylim += 1 : ylim -= 1;
			for(x = x0, y = y0; y != ylim; y += ity){
				if(this.board[y] && this.board[y][x]){
					path.push(this.board[y][x]);
				}
			}
		} else {
			x = x0;
			y = y0;

			for(;x != (x1+itx) && y != (y1+ity);){
				path.push(this.board[y][x]);

				if(itx > 0){
					yint = m*(x+1)+b;
				} else {
					yint = m*x+b;
				}

				if(ity < 0){
					if(yint > y){
						x+=itx;
					} else {
						y+=ity;
					}
				} else {
					if(yint < (y+1)){
						x+=itx;
					} else {
						y+=ity;
					}
				}
			}
		}

		return path;
	};

	/**
	 * This method is depreciated albeit it may be of some future use.
	 * This method returns the cells adjacent to a point on the map, or if given
	 * an agent, those adjacent cells which an agen can move into (not accounting for
	 * how much remaining movement an agent currently has).
	 * @method getAdjacentCells
	 */
	Map.prototype.getAdjacentCells = function(x, y, agent){
		var cells = [];

		if(this.board[y][x+1]){
			if(agent){
				if(agent.canMove("right", this.board, {"x" : x, "y" : y})){
					cells.push({"cell" : this.board[y][x+1], "direction" : "right"});
				}
			} else {
				cells.push(this.board[y][x+1]);
			}
		}
		if(this.board[y][x-1]){
			if(agent){
				if(agent.canMove("left", this.board, {"x" : x, "y" : y})){
					cells.push({"cell" : this.board[y][x-1], "direction" : "left"});
				}
			} else {
				cells.push(this.board[y][x-1]);	
			}
		}
		if(this.board[y+1] && this.board[y+1][x]){
			if(agent){
				if(agent.canMove("down", this.board, {"x" : x, "y" : y})){
					cells.push({"cell" : this.board[y+1][x], "direction" : "down"});
				}
			} else {
				cells.push(this.board[y+1][x]);
			}
		}
		if(this.board[y-1] && this.board[y-1][x]){
			if(agent){
				if(agent.canMove("up", this.board, {"x" : x, "y" : y})){
					cells.push({"cell" : this.board[y-1][x], "direction" : "up"});
				}
			} else {
				cells.push(this.board[y-1][x]);
			}
		}

		return cells;
	};

	/**
	 * A* algorithm as sourced from http://web.mit.edu/eranki/www/tutorials/search/, albeit
	 * modified slighly to suit the needs of this application.
	 * Not necessarily optimized and differs from a prior implementation of mine.
	 * Eg. building a path list once the destination has been reached is a minor weakness
	 * in optimality as the application is intersted in the 'first' move, not the last.

		initialize the open list
		initialize the closed list
		put the starting node on the open list (you can leave its f at zero)

		while the open list is not empty
		    find the node with the least f on the open list, call it "q"
		    pop q off the open list
		    generate q's 8 successors and set their parents to q
		    for each successor
		    	if successor is the goal, stop the search
		        successor.g = q.g + distance between successor and q
		        successor.h = distance from goal to successor
		        successor.f = successor.g + successor.h

		        if a node with the same position as successor is in the OPEN list \
		            which has a lower f than successor, skip this successor
		        if a node with the same position as successor is in the CLOSED list \ 
		            which has a lower f than successor, skip this successor
		        otherwise, add the node to the open list
		    end
		    push q on the closed list
		end

	 * @method aStar
	 * @param {} origin
	 * @param {} destination
	 */
	Map.prototype.aStar = function(origin, destination){
		var map = gh.ptrActiveLevel.mapData.map.board;
		var open = [];
		var closed = [];
		var finish = false;

		open.push(new AStarNode(map[origin.y][origin.x], null, null, 0, gh.getMapDist(origin.x, origin.y, destination.x, destination.y), origin));

		while(open.length > 0 ){
			var q = open[0];
			var n = 0;
			for(var it = 0; it < open.length; it++){
				if(open[it].h < q.h){
					q = open[it];
					n = it;
				}
			}
			open.splice(n, 1);

			var successors = q.getChildren(destination);
			for(var it = 0; it < successors.length; it++){
				if(successors[it].cell.x === destination.x && successors[it].cell.y === destination.y){
					var path = [];
					var node = successors[it];
					while(node.parent !== null){
						path.unshift(node);
						node = node.parent;
					}
					return path;
				} else {
					if(!isVisited(successors[it], open) && !isVisited(successors[it], closed)){
						open.push(successors[it]);
					} 
				}
			}
		}

		return open;	
	};

	/**
	 * @method canMove
	 * @param {gh.Agent} agent
	 * @param {gh.Cell} from
	 * @param {string} direction
	 * @param {} map
	 * @param {gh.Agent} target
	 */
	function canMove(agent, from, direction, map, target){
		var d = direction;
		if(d === "up"){ d = "top"; }
		if(d === "down"){ d = "bottom"; }

		// Does a border block the direction of movement?
		var c = map[from.y][from.x];
		if(!c){ 
			return false; 
		}
		if(c.border){
			var border = c.border[d];
			if(border instanceof gh.Wall){
				if(!border.passable){
					return false;
				}
			}
			if(border instanceof gh.Door){
				if(!border.open){
					return false;
				}
			}
		}

		// Get the destination cell
		var destination;
		switch(direction){
			case "left":
				destination = map[from.y][from.x-1];
				break;
			case "right":
				destination = map[from.y][from.x+1];
				break;
			case "up":
				destination = map[from.y-1][from.x];
				break;
			case "down":
				if(map[from.y+1] && map[from.y+1][from.x]){
					destination = map[from.y+1][from.x];
				}
				break;
			default:
				break;
		}

		// Are we within the map boundary?
		if(!destination){
			return false;
		}

		// Is the a potentially obstructive agent in the cell?
		if(destination.agents && destination.agents.length > 0){
			// Is the target in the destination square?
			for(var it = 0; it < destination.agents.length; it++){
				if(target === destination.agents[it]){
					return true;
				}
			}

			// Can we pass through the agent in the next cell
			var a = destination.agents[destination.agents.length-1];
			if(agent.isHostile(a, gh.ptrActiveLevel.teams)){
				return false;
			}
		}

		return true;
	}

	function isVisited(node, list){
		for(var it = 0; it < list.length; it++){
			if(node.cell === list[it].cell && list[it].h <= node.h){
				return true;
			}
		}
		return false;
	}

	function AStarNode(cell, parent, direction, f, g, agent){
		this.cell = cell;
		this.parent = parent || null;
		this.direction = direction;
		this.f = f;	// distance from origin
		this.g = g; // distance to goal
		this.h = f + g; // heuristic (distance from origin + distance from goal)
		if(agent instanceof gh.Agent){
			this.agent = agent;
		} else {
			this.agent = null;
		}

	}

	AStarNode.prototype.getChildren = function(destination){
		var children = [];
		var map = gh.ptrActiveLevel.mapData.map.board;
		var from = {"x" : this.cell.x, "y" : this.cell.y};

		if(this.agent){
			//if(this.agent.canMove("up", map, {"x" : this.cell.x, "y" : this.cell.y})){
			if(canMove(this.agent, from, "up", map, destination)){
				children.push(
					new AStarNode(
						map[this.cell.y-1][this.cell.x], 
						this, 
						"up", 
						this.f + 1, 
						gh.getMapDist(this.cell.x, this.cell.y-1, destination.x, destination.y), 
						this.agent
					)
				);
			}
			//if(this.agent.canMove("down", map, {"x" : this.cell.x, "y" : this.cell.y})){
			if(canMove(this.agent, from, "down", map, destination)){
				children.push(
					new AStarNode(
						map[this.cell.y+1][this.cell.x], 
						this, 
						"down", 
						this.f + 1, 
						gh.getMapDist(this.cell.x, this.cell.y+1, destination.x, destination.y), 
						this.agent
					)
				);
			}
			//if(this.agent.canMove("left", map, {"x" : this.cell.x, "y" : this.cell.y})){
			if(canMove(this.agent, from, "left", map, destination)){
				children.push(
					new AStarNode(
						map[this.cell.y][this.cell.x-1], 
						this, 
						"left", 
						this.f + 1, 
						gh.getMapDist(this.cell.x-1, this.cell.y, destination.x, destination.y), 
						this.agent
					)
				);
			}
			//if(this.agent.canMove("right", map, {"x" : this.cell.x, "y" : this.cell.y})){
			if(canMove(this.agent, from, "right", map, destination)){
				children.push(
					new AStarNode(
						map[this.cell.y][this.cell.x+1], 
						this, 
						"right", 
						this.f + 1, 
						gh.getMapDist(this.cell.x+1, this.cell.y, destination.x, destination.y), 
						this.agent
					)
				);
			}
		} else {

		}

		return children;
	}

	gh.Map = Map;

	return gh;
})(gh || {});