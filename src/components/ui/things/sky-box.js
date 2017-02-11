module.exports = function (path) {

	var loader = new THREE.CubeTextureLoader();
	
	//loader.setPath('');

	var texture = loader.load(path),
		material = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			envMap: texture,
			side: THREE.BackSide,
			overdraw: 1
		});


		var geometry = new THREE.BoxGeometry( 1000, 1000, 1000 ),
			cube = new THREE.Mesh( geometry, material );

	/*	add it to the scene
	------------------------------------------*/

		this.scene.add( cube );

	return cube;

};
