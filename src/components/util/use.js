module.exports = use;

function use (Super) {
	return {
		toCreate: function (Child) {
			Child.prototype = Object.create(Super.prototype);
			Child.prototype.constructor = Child;
			Child.prototype.parent = Super;
		}
	};
}
