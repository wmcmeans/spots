/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _dotsView = __webpack_require__(4);
	
	var _dotsView2 = _interopRequireDefault(_dotsView);
	
	var _util = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.on('DOMContentLoaded', function () {
	  var rootEl = (0, _util.queryEl)('.dots-game');
	  new _dotsView2.default(rootEl);
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var NEIGHBORS = {
	  top: [0, 1],
	  right: [1, 0],
	  bottom: [0, -1],
	  left: [-1, 0]
	};
	
	var dotIdCounter = 0;
	
	var Dot = function Dot(options) {
	  this.pos = options.pos;
	  this.color = options.color;
	  this.occupiedEntries = {};
	  this.isHead = false;
	
	  this.id = dotIdCounter;
	  dotIdCounter++;
	};
	
	Dot.prototype.canConnectWith = function (otherDot) {
	  var relativeLocation = this.findNeighbor(otherDot);
	  var sameColor = this.color === otherDot.color;
	
	  if (relativeLocation && sameColor) {
	    return !this.occupiedEntries[relativeLocation];
	  }
	};
	
	Dot.prototype.findNeighbor = function (otherDot) {
	  for (var location in NEIGHBORS) {
	    var x = NEIGHBORS[location][0];
	    var y = NEIGHBORS[location][1];
	    if (this.pos[0] + x === otherDot.pos[0] && this.pos[1] + y === otherDot.pos[1]) {
	      return location;
	    }
	  }
	
	  return null;
	};
	
	Dot.prototype.isSquared = function () {
	  var connections = 0;
	  for (var location in this.occupiedEntries) {
	    if (this.occupiedEntries[location]) {
	      connections++;
	    }
	  }
	
	  return connections > 2 || connections === 2 && this.isHead;
	};
	
	var Board = function Board() {
	  this.selectedDots = [];
	  this.setup();
	};
	
	Board.colors = ["purple", "green", "blue", "red", "yellow"];
	
	var randomColor = function randomColor() {
	  var idx = Math.floor(Math.random() * 5);
	  return Board.colors[idx];
	};
	
	var dotSort = function dotSort(dot1, dot2) {
	  if (dot1.pos[0] === dot2.pos[0]) {
	    // sort so that higher dot is removed first/doesn't disrupt other positions
	    if (dot1.pos[1] > dot2.pos[1]) {
	      return -1;
	    } else {
	      return 1;
	    }
	  } else if (dot1.pos[0] > dot2.pos[0]) {
	    return -1;
	  } else {
	    return 1;
	  }
	};
	
	Board.prototype.formConnection = function (newSpot) {
	  var prevTail = this.selectionTail();
	  var exit = prevTail.findNeighbor(newSpot);
	  var entry = getOppositeEntry(exit);
	
	  prevTail.occupiedEntries[exit] = true;
	  newSpot.occupiedEntries[entry] = true;
	
	  this.selectedDots.push(newSpot);
	};
	
	Board.prototype.removeLastConnection = function () {
	  if (this.selectedDots.length < 2) {
	    return;
	  }
	  var newestConnection = this.newestConnection();
	  var entry = newestConnection[1].findNeighbor(newestConnection[0]);
	  var exit = getOppositeEntry(entry);
	
	  newestConnection[1].occupiedEntries[entry] = false;
	  newestConnection[0].occupiedEntries[exit] = false;
	
	  this.selectedDots.pop();
	};
	
	Board.prototype.newestConnection = function () {
	  if (this.selectedDots.length < 2) {
	    return;
	  }
	  var lastIdx = this.selectedDots.length - 1;
	  return [this.selectedDots[lastIdx - 1], this.selectedDots[lastIdx]];
	};
	
	Board.prototype.lastEntryPoint = function () {
	  var lastConnection = this.newestConnection();
	  if (!lastConnection) {
	    return;
	  }
	  return lastConnection[1].findNeighbor(lastConnection[0]);
	};
	
	Board.prototype.resetSelections = function () {
	  if (this.selectedDots[0]) {
	    this.selectedDots[0].isHead = false;
	  }
	  this.selectedDots.forEach(function (dot) {
	    dot.occupiedEntries = {};
	  });
	  this.selectedDots = [];
	};
	
	Board.prototype.selectedColor = function () {
	  return this.selectedDots[0].color;
	};
	
	Board.prototype.startConnection = function (headDot) {
	  this.selectedDots = [headDot];
	};
	
	Board.prototype.selectionTail = function () {
	  return this.selectedDots[this.selectedDots.length - 1];
	};
	
	Board.prototype.anySquares = function () {
	  var anySquare = this.selectedDots.find(function (dot) {
	    if (dot.isSquared()) {
	      return true;
	    }
	  });
	
	  return anySquare;
	};
	
	Board.prototype.adjustForSquares = function () {
	  if (this.anySquares()) {
	    var selectedColor = this.selectedDots[0].color;
	
	    this.selectedDots = [];
	    for (var i = 0; i < 6; i++) {
	      for (var j = 0; j < 6; j++) {
	        if (this.grid[i][j].color === selectedColor) {
	          this.selectedDots.push(this.grid[i][j]);
	        }
	      }
	    }
	  }
	};
	
	Board.prototype.setup = function () {
	  this.grid = [];
	
	  for (var x = 0; x < 6; x++) {
	    var column = [];
	    for (var y = 0; y < 6; y++) {
	      var dot = new Dot({
	        pos: [x, y],
	        color: randomColor()
	      });
	      column.push(dot);
	    }
	    this.grid.push(column);
	  }
	};
	
	Board.prototype.update = function () {
	  var sortedDots = this.selectedDots.sort(dotSort);
	
	  this.selectedDots.forEach(function (dot) {
	    var dotColumn = dot.pos[0];
	    var dotRow = dot.pos[1];
	
	    this.grid[dotColumn].splice(dotRow, 1);
	
	    for (var i = dotRow; i < 5; i++) {
	      this.grid[dotColumn][i].pos[1] = i;
	    }
	
	    this.grid[dotColumn].push(new Dot({
	      pos: [dotColumn, i],
	      color: randomColor()
	    }));
	  }.bind(this));
	};
	
	function getOppositeEntry(location) {
	  switch (location) {
	    case "top":
	      return "bottom";
	    case "right":
	      return "left";
	    case "bottom":
	      return "top";
	    case "left":
	      return "right";
	  }
	}
	
	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var Game = function Game(board, moves) {
	  this.board = board;
	  this.moves = moves || 30;
	  this.score = 0;
	};
	
	Game.prototype.scoreDots = function () {
	  var points = this.board.selectedDots.length;
	  if (points > 1) {
	    this.board.adjustForSquares();
	    this.score += points;
	    this.moves -= 1;
	    this.board.update();
	  }
	
	  this.board.resetSelections();
	  return points;
	};
	
	Game.prototype.clearMove = function () {
	  this.board.resetSelections();
	};
	
	Game.prototype.beginMove = function (spotPos) {
	  var startSpot = this.board.grid[spotPos[0]][spotPos[1]];
	
	  startSpot.isHead = true;
	  this.board.selectedDots = [startSpot];
	  this.selectedColor = startSpot.color;
	};
	
	Game.prototype.addSpotToSelection = function (spotPos) {
	  var prevDot = this.board.selectionTail();
	  if (spotPos[0] === prevDot.pos[0] && spotPos[1] === prevDot.pos[1]) {
	    return false;
	  }
	
	  var newDot = this.board.grid[spotPos[0]][spotPos[1]];
	  if (prevDot.canConnectWith(newDot)) {
	    this.board.formConnection(newDot);
	    return true;
	  }
	};
	
	Game.prototype.revertSelection = function () {
	  this.board.removeLastConnection();
	};
	
	Game.prototype.over = function () {
	  return this.moves <= 0;
	};
	
	module.exports = Game;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Board = __webpack_require__(2);
	var Game = __webpack_require__(3);
	
	var View = function View($el) {
	  this.$el = $el;
	
	  this.renderMenu();
	};
	
	View.prototype.newGame = function (event) {
	  this.board = new Board();
	  this.game = new Game(this.board);
	
	  this.newHighScore = false;
	
	  this.renderGame();
	};
	
	View.prototype.renderGame = function (event) {
	  this.setupScoreBoard();
	  this.setupGrid();
	  this.render();
	
	  $('.dots-game').on("mousedown vmousedown", this.beginMove.bind(this));
	  $(window).on("mouseup vmouseup", this.endMove.bind(this));
	  $('.directions-link').click(this.renderMenu.bind(this));
	};
	
	View.prototype.beginMove = function (event) {
	  event.preventDefault();
	  if (event.target.classList[0] !== "spot") {
	    return;
	  }
	
	  var dotPos = [event.target.id[0], event.target.id[2]];
	  var board = this.board;
	  var game = this.game;
	
	  game.beginMove(dotPos);
	  $(event.target).addClass('active');
	
	  $('div.' + this.game.selectedColor).on("mouseenter touchenter", function (e) {
	    var newPos = [parseInt(e.target.id[0]), parseInt(e.target.id[2])];
	
	    if (game.addSpotToSelection(newPos)) {
	      activateHTMLConnection();
	      $(e.target).addClass('active');
	
	      if (board.selectionTail().isSquared()) {
	        $('div.' + board.selectedColor()).addClass('squared');
	      }
	    }
	  });
	
	  $('div.' + this.game.selectedColor).on("mouseleave touchleave", function (e) {
	    var exitEdge = closestEdge(e);
	
	    if (exitEdge === board.lastEntryPoint()) {
	      game.revertSelection();
	      updateHTMLConnections();
	
	      $(e.target).removeClass('active');
	      if (!board.anySquares()) {
	        $('div.' + board.selectedColor()).removeClass('squared');
	      }
	    }
	  });
	
	  function activateHTMLConnection() {
	    var dots = game.board.newestConnection();
	
	    updateConnectionClass(dots);
	  }
	
	  function updateConnectionClass(dots) {
	    var htmlId = getPossibleHTMLIds(dots);
	
	    $('li#' + htmlId[0] + "to" + htmlId[1]).addClass('active ' + board.selectedColor());
	    $('li#' + htmlId[1] + "to" + htmlId[0]).addClass('active ' + board.selectedColor());
	  }
	
	  function updateHTMLConnections() {
	    $('li').removeClass('active ' + board.selectedColor());
	
	    for (var i = 0; i < board.selectedDots.length - 1; i++) {
	      var dots = [board.selectedDots[i], board.selectedDots[i + 1]];
	      updateConnectionClass(dots);
	    }
	  }
	
	  function getPossibleHTMLIds(dots) {
	    var dot1 = dots[0];
	    var dot2 = dots[1];
	    return [dot1.pos[0] + "-" + dot1.pos[1], dot2.pos[0] + "-" + dot2.pos[1]];
	  }
	
	  function getOppositeEntry(location) {
	    switch (location) {
	      case "top":
	        return "bottom";
	      case "right":
	        return "left";
	      case "bottom":
	        return "top";
	      case "left":
	        return "right";
	    }
	  }
	};
	
	View.prototype.endMove = function (event) {
	  $('div.spot').unbind();
	  $('li.connection').attr('class', 'connection');
	  $('div.spot').removeClass('active');
	
	  var points = this.game.scoreDots();
	  if (points > 1) {
	    this.render();
	  }
	
	  if (this.game.over()) {
	    this.setHighScore();
	    $(".dots-game").unbind();
	    $(window).unbind("mouseup");
	    this.renderMenu();
	  }
	};
	
	View.prototype.render = function () {
	  this.updateScore();
	  this.updateSpots();
	  this.renderSpotDrops();
	};
	
	View.prototype.setHighScore = function () {
	  var highScore = localStorage.getItem('dotsHighScore');
	  if (this.game.score > highScore) {
	    localStorage.setItem('dotsHighScore', this.game.score);
	    this.newHighScore = true;
	  }
	};
	
	View.prototype.updateSpots = function () {
	  var grid = this.board.grid;
	  for (var i = 0; i < grid.length; i++) {
	
	    var column = grid[i];
	    for (var j = 0; j < 6; j++) {
	      var spot = column[j];
	      var spotX = spot.pos[0];
	      var spotY = spot.pos[1];
	    }
	  }
	
	  this.board.grid.forEach(function (column, x) {
	    column.forEach(function (spot, y) {
	      var spotX = spot.pos[0];
	      var spotY = spot.pos[1];
	      var spotNode = this.$spot.filter("#" + spotX + "-" + spotY);
	      if (!spotNode.hasClass('spot-id-' + spot.id)) {
	        spotNode.before("<li class='position empty-node'></li>");
	      }
	      spotNode.attr("class", "spot " + spot.color + " spot-id-" + spot.id);
	    }.bind(this));
	  }.bind(this));
	};
	
	View.prototype.renderSpotDrops = function () {
	  var emptyNodes = $('li.empty-node');
	  emptyNodes.animate({ height: 0 }, 170, "linear", function () {
	    $(this).remove();
	  });
	};
	
	View.prototype.getDirectionsHTML = function () {
	  var html = "<section class='game-menu'>" + "<h3>Directions</h3>" + "<p>Connect the dots of the same color to score points.</p>" + "<p>Form rectangles to collect all dots of the same color.</p>";
	  if (!this.game) {
	    html += "<button class='game-button new-game'>New Game</button>";
	  } else {
	    html += "<button class='game-button back-to-game'>Back to Game</button>";
	  }
	  html += "</section>";
	  return html;
	};
	
	View.prototype.getGameOverHTML = function () {
	  var html = "<section class='game-menu'>" + "<h3>Game Over</h3>";
	  if (this.newHighScore) {
	    html += "<p>Congratulations! You scored a new personal high score.</p>" + "<p>New high score: " + this.game.score + "</p>";
	  } else {
	    html += "<p>You scored " + this.game.score + " points.</p>" + "<p>Your high score is " + localStorage.getItem('dotsHighScore') + ".</p>";
	  }
	  html += "<button class='game-button new-game'>New Game</button>" + "</section>";
	  return html;
	};
	
	View.prototype.updateScore = function () {
	  this.$moves.html("Moves Left: " + this.game.moves);
	  this.$score.html("Score: " + this.game.score);
	};
	
	View.prototype.renderMenu = function () {
	  var html;
	  if (this.game && this.game.over()) {
	    html = this.getGameOverHTML();
	  } else {
	    html = this.getDirectionsHTML();
	  }
	  this.$el.html(html);
	
	  $('button.new-game').click(this.newGame.bind(this));
	  $('button.back-to-game').click(this.renderGame.bind(this));
	};
	
	View.prototype.setupScoreBoard = function () {
	  var html = "<p><a class='directions-link'>Directions</a></p>";
	  html += "<h2 class='scoreboard group'>";
	  html += "<span class='moves-left'></span>";
	  html += "<span class='score'></span>";
	  html += "</h2>";
	  this.$el.html(html);
	  this.$moves = this.$el.find('.moves-left');
	  this.$score = this.$el.find('.score');
	};
	
	View.prototype.setupGrid = function () {
	  var board = "<figure class='game-board'>";
	  var spots = "<section class='spots-board group'>";
	  var verticalConnections = "<section class='connections-board vertical'>";
	  var horizontalConnections = "<section class='connections-board horizontal'>";
	  for (var x = 0; x < 6; x++) {
	    spots += "<ul id='" + x + "' class='column group'>";
	    if (x < 5) {}
	    verticalConnections += "<ul class='vertical connections group'>";
	    horizontalConnections += "<ul class='horizontal connections group'>";
	    for (var y = 0; y < 6; y++) {
	      spots += "<li class='position'><div class='spot' id='" + x + "-" + y + "'></div></li>";
	      if (y < 5) {
	        verticalConnections += "<li class='connection' id='" + x + "-" + y + "to" + x + "-" + (y + 1) + "'></li>";
	        horizontalConnections += "<li class='connection' id='" + y + "-" + x + "to" + (y + 1) + "-" + x + "'></li>";
	      }
	    }
	    spots += "</ul>";
	    horizontalConnections += "</ul>";
	    verticalConnections += "</ul>";
	  }
	  spots += "</section>";
	  horizontalConnections += "</section>";
	  verticalConnections += "</section>";
	  board += spots;
	  board += horizontalConnections;
	  board += verticalConnections;
	  board += "</figure>";
	
	  this.$el.append(board);
	  this.$spot = this.$el.find("div.spot");
	  this.$connections = this.$el.find("li.connection");
	};
	
	closestEdge = function closestEdge(event) {
	  return closestEdgeFromDimensions(event.pageX - $(event.target).offset().left, event.pageY - $(event.target).offset().top, $(event.target).width(), $(event.target).height());
	};
	
	closestEdgeFromDimensions = function closestEdgeFromDimensions(x, y, w, h) {
	  var topEdgeDist = distMetric(x, y, w / 2, 0);
	  var bottomEdgeDist = distMetric(x, y, w / 2, h);
	  var leftEdgeDist = distMetric(x, y, 0, h / 2);
	  var rightEdgeDist = distMetric(x, y, w, h / 2);
	  var min = Math.min(topEdgeDist, bottomEdgeDist, leftEdgeDist, rightEdgeDist);
	
	  switch (min) {
	    case leftEdgeDist:
	      return "left";
	    case rightEdgeDist:
	      return "right";
	    case topEdgeDist:
	      return "top";
	    case bottomEdgeDist:
	      return "bottom";
	  }
	};
	
	var distMetric = function distMetric(x, y, x2, y2) {
	  var xDiff = x - x2;
	  var yDiff = y - y2;
	  return xDiff * xDiff + yDiff * yDiff;
	};
	
	module.exports = View;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var queryEl = exports.queryEl = function queryEl(selector) {
	  return document.querySelector(selector);
	};
	var queryElAll = exports.queryElAll = function queryElAll(selector) {
	  return document.querySelectorAll(selector);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map