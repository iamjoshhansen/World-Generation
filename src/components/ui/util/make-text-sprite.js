module.exports = function ( message, parameters ) {
	if ( parameters === undefined ) parameters = {};
	var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial",
		fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18,
		borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4,
		borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 },
		backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 },
		textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

	var size = (function (message, fontsize, fontface) {
			
			var canvas = document.createElement('canvas'),
				context = canvas.getContext('2d');

			context.font = fontsize + "px " + fontface;

			var metrics = context.measureText( message ),
				textWidth = metrics.width,
				size = _.max([200, textWidth, fontsize]);

			return size;

		})(message, fontsize, fontface);


	// reset to actual size!
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;

	context = canvas.getContext('2d');

	context.font = fontsize + "px " + fontface;

	context.fillStyle = "rgba(0, 0, 0, 0.1)";
	context.fillRect(0, size - fontsize, size, fontsize);

	context.textAlign = "center";
	context.fillStyle = "rgb(0,0,0)";
	context.fillText(message, size / 2, size - 5);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture } ),
		sprite = new THREE.Sprite( spriteMaterial ),
		scale = 15;

	sprite.scale.set(scale, scale, scale);

	return sprite;
};