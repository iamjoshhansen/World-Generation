module.exports = function (params) {
	params = params || {};

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshLambertMaterial( { color: 0x0099ff, overdraw: 0.5 } );
	var cube = new THREE.Mesh( geometry, material );

	_.extend(cube.position, params.position || {});
	_.extend(cube.rotation, params.rotation || {});

	this.scene.add( cube );

	return cube;

};
