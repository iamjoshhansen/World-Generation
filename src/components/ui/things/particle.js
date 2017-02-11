module.exports = function (params) {
	params = params || {};

	var self = this;

	var spriteMap = new THREE.TextureLoader().load( "../images/dot.png" ),
		spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } ),
		particle = new THREE.Sprite( spriteMaterial );

	_.extend(particle.position, params.position || {});
	particle.scale.x = ForceGraphWebGL.SPRITE_SCALE;
	particle.scale.y = ForceGraphWebGL.SPRITE_SCALE;

	self.scene.add(particle);

	return particle;

};
