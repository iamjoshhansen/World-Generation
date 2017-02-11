module.exports = XBoxController;


var extendEvents    = require('../../util/extend-jquery-events.js'),
	mixinProperties = require('../../util/properties.js');


/*	Constructor
------------------------------------------*/
	function XBoxController (index) {

		extendEvents(this);

		this.index = index;

		var properties = {

				is_active: {
					default: false,
					types: ['boolean']
				}

			};

		// buttons
		_.each(XBoxController.buttons, function (name) {
			properties[name] = {
				default: false,
				types: ['boolean']
			};
		});

		// axes
		_.each(XBoxController.axes, function (name) {
			properties[name] = {
				default: 0,
				types: ['number']
			};
		});

		//properties.right_trigger.default = -1;
		//properties.left_trigger.default = -1;

		mixinProperties(this, {}, properties);

	}


/*	Static
------------------------------------------*/
	_.extend(XBoxController, {

		buttons: [
			"a",
			"b",
			"x",
			"y",
			"bumper_left",
			"bumper_right",
			"left_trigger",
			"right_trigger",
			"stick_left",
			"stick_right",
			"start",
			"select",
			"home",
			"dp_up",
			"dp_down",
			"dp_left",
			"dp_right"
		],

		axes: [
			"left_x",
			"left_y",
			"right_x",
			"right_y"
		]

	});



/*	Prototype
------------------------------------------*/
	_.extend(XBoxController.prototype, {

		update: function () {
			var self = this,
				gamepad = navigator.getGamepads()[this.index];

			if (gamepad) {
				self.setIsActive(true);

				_.each(XBoxController.buttons, function (button_name, i) {
					self[_.camelCase('set-'+button_name)](gamepad.buttons[i].pressed);
				});

				_.each(XBoxController.axes, function (axis_name, i) {
					self[_.camelCase('set-'+axis_name)](gamepad.axes[i]);
				});
			} else {
				self.setIsActive(false);
				_.each(XBoxController.buttons, function (button_name) {
					self[_.camelCase('set-'+button_name)](false);
				});

				_.each(XBoxController.axes, function (axis_name, i) {
					self[_.camelCase('set-'+axis_name)](0);
				});
			}
		},

		toJSON: function () {
			var self = this,
				ret = {};

			_.each(XBoxController.buttons, function (button_name, i) {
				ret[button_name] = self[button_name];
			});

			_.each(XBoxController.axes, function (axis_name, i) {
				ret[axis_name] = self[axis_name];
			});

			return ret;
		}

	});
