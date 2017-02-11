module.exports = function (params) {
	params = params || {};

	var geometry = new THREE.SphereGeometry( 1, 32, 32 );
	var material = new THREE.MeshToonMaterial( { color: params.color || 0x999999, overdraw: 0.5 } );
	var cube = new THREE.Mesh( geometry, material );

	_.extend(cube.position, params.position || {});
	_.extend(cube.rotation, params.rotation || {});

	this.scene.add( cube );

	return cube;

};
