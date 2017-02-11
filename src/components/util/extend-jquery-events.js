module.exports = function (target) {
	_.forEach(['on','off','trigger','one','triggerHandler'], function (ev) {
		target[ev] = function () {
			$.fn[ev].apply($(this), arguments);
			return this;
		};
	});
};
