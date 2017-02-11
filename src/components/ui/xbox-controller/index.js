var XBoxController = require('./xbox-controller.js'),
	controllers = _.map(navigator.getGamepads(), function (pad, i) {
		return new XBoxController(i);
	});

module.exports = {
	controllers: controllers,
	update: function () {
		_.each(controllers, function (controller) {
			controller.update();
		});
	}
};
