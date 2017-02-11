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

