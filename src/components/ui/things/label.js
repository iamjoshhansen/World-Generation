module.exports = function (message, params) {

	params = params || {};

	var self = this;

	var sprite = ForceGraphWebGL.makeTextSprite(message, {
			fontface: '"Exo 2"',
			fontsize: 32
		});
	sprite.visible = false;

	_.extend(sprite.position, params.position || {});

	self.scene.add(sprite);

	return sprite;
};
