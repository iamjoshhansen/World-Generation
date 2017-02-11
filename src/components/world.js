module.exports = World;

var Grid = require('./grid.js');

function World (size) {

	this.grids = {};
	this.map = {};


	this.size = size;

}


_.extend(World, {

	//

});


_.extend(World.prototype, {

	toString: function () {

		var arr = [],
			max_x = 0,
			max_y = 0;

		_.each(this.grids, function (grid, id) {

			_.each(grid.squares, function (square) {

				var x = (grid.x * grid.size) + square.x,
					y = (grid.y * grid.size) + square.y,
					val = square.value;

				max_x = Math.max(max_x, x);
				max_y = Math.max(max_y, y);

				_.set(arr, y + '.' + x, val);

			});

		});

		_.each(arr, function (row) {
			if (row === null) {
				row = [];
			}
		});

		return arr.map(function (row) {
			return row.join('');
		}).join('\n');

	},

	getMap: function (x, y) {

		var key = x + '_' + y;

		if ( ! (key in this.map)) {
			var val = _.random(0,10);  // <--- Later, this can be based on something smarter (like biomes)
			
			if (val == 6) {
				val += 10 + _.random(5);
			}
			
			this.map[key] = val;
		}

		return this.map[key];

	},

	getGrid: function (x, y) {

		var key = x + '_' + y;

		if ( ! (key in this.grids)) {

			this.grids[key] = new Grid({
				world: this,
				size: this.size,
				x: x,
				y: y,
				corners: [
					this.getMap(x,y),
					this.getMap(x+1, y),
					this.getMap(x+1, y+1),
					this.getMap(x, y+1)
				]
			});

		}

		return this.grids[key];

	}

});

