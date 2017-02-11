module.exports = Grid;

var Square = require('./square.js');

function Grid (params) {

	this.squares = [];

	this.size = params.size;
	this.x = params.x;
	this.y = params.y;
	this.corners = params.corners;
	this.world = params.world;

	this.size++;

	var len = this.size * this.size;

	for (var i=0; i<len; i++) {
		this.squares.push(new Square({
			grid: this,
			x: i % this.size,
			y: Math.floor(i / this.size)
		}));
	}

	this.getSquare(0,0).value                     = this.corners[0];
	this.getSquare(this.size-1,0).value           = this.corners[1];
	this.getSquare(this.size-1,this.size-1).value = this.corners[2];
	this.getSquare(0,this.size-1).value           = this.corners[3];

	this.interpolate();
	this.trimRightBottomEdges();

}

_.extend(Grid, {

	linearInterpolate: function interpolate (start, end, steps) {
		var arr = [],
			delta = end - start;

		for (var i=0; i<steps; i++) {
			var j = i / (steps-1);
			arr.push(start + (delta * j));
		}

		return arr;
	}

});

_.extend(Grid.prototype, {

	toString: function () {

		var self = this,
			str = '';

		_.each(self.squares, function (square) {
			str += (_.isNumber(square.value) && ! isNaN(square.value)) ? square.value : '-';
			if (square.x === self.size-1) {
				str += '\n';
			}
		});

		return str;
	},

	getSquare: function (x, y) {
		return this.squares[(y * this.size) + x];
	},

	step: function (start, end, step) {
		var percent = step / (this.size - 1),
			step = start + ((end - start) * percent);

		step = Math.round(step);

		return step;
	},

	interpolate: function () {

		var self = this;

		_.each(this.squares, function (square) {
			if (typeof(square.value) == 'undefined') {

				square.value = self.getInterpolatedValue(square.x, square.y);

			}
		});

	},

	getInterpolatedValue: function (x, y) {

		var square = this.getSquare(x,y);

		if (typeof(square.value) == 'undefined') {

			// on left edge?
			if (square.x === 0) {
				
				var top = this.corners[0],
					bottom = this.corners[3];

				square.value = this.step(top, bottom, square.y);

			}

			// on right edge?
			else if (square.x === this.size - 1) {
				var top = this.corners[1],
					bottom = this.corners[2];

				square.value = this.step(top, bottom, square.y);
			}

			else {

				var left = this.getInterpolatedValue(0, square.y),
					right = this.getInterpolatedValue(this.size-1, square.y);
				
				square.value = this.step(left, right, square.x);

			}

		}

		return square.value;
	},

	trimRightBottomEdges: function () {

		for (var i = this.squares.length - 1; i >= 0; i--) {
			var square = this.squares[i];
			if (square.x === this.size-1 || square.y === this.size-1) {
				this.squares.splice(i,1);
			}
		};

		this.size--;

	}

});

