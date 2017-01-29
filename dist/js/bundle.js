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
	
	var _Game = __webpack_require__(4);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = (0, _util.queryEl)('#spots-game');
	  new _Game2.default(canvas).start();
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fixCanvasBlur = exports.getOppositeDelta = exports.randomColor = exports.queryElAll = exports.queryEl = undefined;
	
	var _constants = __webpack_require__(8);
	
	var queryEl = exports.queryEl = function queryEl(selector) {
	  return document.querySelector(selector);
	};
	var queryElAll = exports.queryElAll = function queryElAll(selector) {
	  return document.querySelectorAll(selector);
	};
	
	var randomColor = exports.randomColor = function randomColor() {
	  var idx = Math.floor(Math.random() * 5);
	  return _constants.COLORS_ARRAY[idx];
	};
	
	var getOppositeDelta = exports.getOppositeDelta = function getOppositeDelta(delta) {
	  switch (delta) {
	    case 'top':
	      return 'bottom';
	    case 'right':
	      return 'left';
	    case 'bottom':
	      return 'top';
	    case 'left':
	      return 'right';
	    default:
	      throw new Error('delta not found in list of deltas');
	  }
	};
	
	var fixCanvasBlur = exports.fixCanvasBlur = function fixCanvasBlur(canvas) {
	  var context = canvas.getContext('2d');
	  var devicePixelRatio = window.devicePixelRatio || 1;
	  var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
	
	  var ratio = devicePixelRatio / backingStoreRatio;
	
	  if (devicePixelRatio !== backingStoreRatio) {
	    var oldWidth = canvas.width;
	    var oldHeight = canvas.height;
	
	    canvas.width = oldWidth * ratio;
	    canvas.height = oldHeight * ratio;
	
	    canvas.style.width = oldWidth + 'px';
	    canvas.style.height = oldHeight + 'px';
	
	    // now scale the context to counter
	    // the fact that we've manually scaled
	    // our canvas element
	    context.scale(ratio, ratio);
	  }
	};

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Board = __webpack_require__(5);
	
	var _Board2 = _interopRequireDefault(_Board);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SpotsGame = function () {
	  function SpotsGame(canvas) {
	    _classCallCheck(this, SpotsGame);
	
	    this.xDim = canvas.offsetWidth;
	    this.yDim = canvas.offsetHeight;
	    this.ctx = canvas.getContext('2d');
	    (0, _util.fixCanvasBlur)(canvas);
	
	    this.trackCursor();
	
	    this.board = new _Board2.default();
	  }
	
	  _createClass(SpotsGame, [{
	    key: 'beginMove',
	    value: function beginMove() {
	      this.moving = true;
	      this.board.beginMove(this.cursorPos);
	    }
	  }, {
	    key: 'endMove',
	    value: function endMove() {
	      this.moving = false;
	      console.log('ending');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.ctx.clearRect(0, 0, this.xDim, this.yDim);
	
	      this.board.draw(this.ctx, this.cursorPos);
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this = this;
	
	      var animate = function animate() {
	        _this.render();
	        requestAnimationFrame(animate);
	      };
	      animate();
	      this.trackMoves();
	    }
	  }, {
	    key: 'trackCursor',
	    value: function trackCursor() {
	      var _this2 = this;
	
	      this.cursorPos = { x: 0, y: 0 };
	      var getCursorPos = function getCursorPos(event) {
	        event.preventDefault();
	        event.stopPropagation();
	
	        var x = event.clientX - _this2.ctx.canvas.offsetLeft;
	        var y = event.clientY - _this2.ctx.canvas.offsetTop;
	        _this2.cursorPos = { x: x, y: y };
	      };
	
	      document.addEventListener('mousemove', getCursorPos);
	    }
	  }, {
	    key: 'trackMoves',
	    value: function trackMoves() {
	      var _this3 = this;
	
	      this.ctx.canvas.addEventListener('mousedown', function () {
	        return _this3.beginMove();
	      });
	      window.addEventListener('mouseup', function () {
	        return _this3.endMove();
	      });
	    }
	  }]);
	
	  return SpotsGame;
	}();
	
	exports.default = SpotsGame;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Spot = __webpack_require__(7);
	
	var _Spot2 = _interopRequireDefault(_Spot);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board() {
	    _classCallCheck(this, Board);
	
	    this.selectedSpots = [];
	    this.setup();
	  }
	
	  _createClass(Board, [{
	    key: 'addSpotToMove',
	    value: function addSpotToMove(spot) {
	      spot.setActive();
	      this.selectedSpots.push(spot);
	    }
	  }, {
	    key: 'beginMove',
	    value: function beginMove(cursorPos) {
	      var firstSpot = this.findActiveSpot(cursorPos);
	      if (firstSpot) {
	        this.addSpotToMove(firstSpot);
	      }
	    }
	  }, {
	    key: 'draw',
	    value: function draw(ctx, cursorPos) {
	      var _this = this;
	
	      this.squareSize = ctx.canvas.offsetWidth / this.grid.length;
	
	      this.grid.forEach(function (row) {
	        return row.forEach(function (spot) {
	          return spot.draw(ctx, _this.squareSize, cursorPos);
	        });
	      });
	    }
	  }, {
	    key: 'findActiveSpot',
	    value: function findActiveSpot(cursorPos) {
	      for (var i = 0; i < this.grid.length; i++) {
	        for (var j = 0; j < this.grid[0].length; j++) {
	          var spot = this.grid[i][j];
	          if (spot.isMouseOver(cursorPos)) return spot;
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      this.grid = [];
	
	      for (var y = 0; y < 6; y++) {
	        var row = [];
	        for (var x = 0; x < 6; x++) {
	          var spot = new _Spot2.default({
	            pos: { x: x, y: y },
	            color: (0, _util.randomColor)()
	          });
	          row.push(spot);
	        }
	        this.grid.push(row);
	      }
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constants = __webpack_require__(8);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Spot = function () {
	  function Spot(_ref) {
	    var pos = _ref.pos,
	        color = _ref.color;
	
	    _classCallCheck(this, Spot);
	
	    this.pos = pos;
	    this.color = color;
	    this.setInactive();
	  }
	
	  _createClass(Spot, [{
	    key: 'canConnectWith',
	    value: function canConnectWith(otherDot) {
	      var neighbor = this.isNeighboring(otherDot.pos);
	      var sameColor = this.color === otherDot.color;
	
	      return neighbor && sameColor;
	    }
	  }, {
	    key: 'draw',
	    value: function draw(ctx, sizeOfSpace, cursorPos) {
	      this.setCanvasPos(sizeOfSpace);
	
	      if (this.isMouseOver(cursorPos)) {
	        console.log('mouse over [' + this.pos.x + ', ' + this.pos.y + '] (' + this.color + ')');
	      }
	
	      ctx.fillStyle = this.color;
	      ctx.beginPath();
	      ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.canvasPos.radius, 0, Math.PI * 2);
	      ctx.fill();
	    }
	  }, {
	    key: 'isNeighboring',
	    value: function isNeighboring(otherPos) {
	      var _this = this;
	
	      return Object.entries(_constants.DELTAS).find(function (_ref2) {
	        var _ref3 = _slicedToArray(_ref2, 2),
	            delta = _ref3[0],
	            _ref3$ = _ref3[1],
	            x = _ref3$.x,
	            y = _ref3$.y;
	
	        if (_this.pos.x + x === otherPos.x && _this.pos.y + y === otherPos.y) {
	          return delta;
	        }
	        return false;
	      });
	    }
	  }, {
	    key: 'setActive',
	    value: function setActive() {
	      this.radiusPct = 0.25;
	    }
	  }, {
	    key: 'setCanvasPos',
	    value: function setCanvasPos(sizeOfSpace) {
	      this.canvasPos = {
	        cx: this.pos.x * sizeOfSpace + sizeOfSpace / 2,
	        cy: this.pos.y * sizeOfSpace + sizeOfSpace / 2,
	        radius: sizeOfSpace * this.radiusPct
	      };
	    }
	  }, {
	    key: 'setInactive',
	    value: function setInactive() {
	      this.radiusPct = 0.22;
	    }
	  }, {
	    key: 'isMouseOver',
	    value: function isMouseOver(cursorPos) {
	      var dx = cursorPos.x - this.canvasPos.cx;
	      var dy = cursorPos.y - this.canvasPos.cy;
	      return dx * dx + dy * dy <= this.canvasPos.radius * this.canvasPos.radius;
	    }
	  }]);
	
	  return Spot;
	}();
	
	exports.default = Spot;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var COLORS = exports.COLORS = {
	  PURPLE: '#9d5ab7',
	  GREEN: '#89ed90',
	  BLUE: '#8abdff',
	  RED: '#f15c3b',
	  YELLOW: '#e7dd00'
	};
	
	var COLORS_ARRAY = exports.COLORS_ARRAY = Object.values(COLORS);
	
	var DELTAS = exports.DELTAS = {
	  top: { x: 0, y: 1 },
	  right: { x: 1, y: 0 },
	  bottom: { x: 0, y: -1 },
	  left: { x: -1, y: 0 }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map