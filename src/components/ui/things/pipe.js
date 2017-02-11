module.exports = function (params) {

	var point_a = params.point_a,
		point_b = params.point_b,

		pad = 4;

	var pipe_geometry  = new THREE.CylinderGeometry(0.1, 0.1, 1, 8, 1),
		arrow_geometry = new THREE.CylinderGeometry(0.3, 0, 1, 8, 1),
		material       = new THREE.MeshLambertMaterial( { color : params.color || 0xcccccc } );

	var pipe  = new THREE.Mesh( pipe_geometry,  material ),
		arrow = new THREE.Mesh( arrow_geometry, material );

	pipe.positionBetween = function (point_a, point_b) {
		var a = new THREE.Vector3( point_a.x, point_a.y, point_a.z ),
			b = new THREE.Vector3( point_b.x, point_b.y, point_b.z ),
			distance = a.distanceTo( b );

		var dir = b.clone().sub(a).normalize().multiplyScalar(pad),
			c = a.clone().add(dir);

		/*	Arrow Head
		------------------------------------------*/
			_.extend(arrow.position, c);
			arrow.lookAt(point_b);
			arrow.rotateX(Math.PI / 2);
			arrow.scale.y = 1;

		/*	Pipe
		------------------------------------------*/
			pipe.scale.y = distance - (pad * 2);
			pipe.position.x = (point_a.x + point_b.x) / 2;
			pipe.position.y = (point_a.y + point_b.y) / 2;
			pipe.position.z = (point_a.z + point_b.z) / 2;

			pipe.lookAt(point_b);
			pipe.rotateX(Math.PI / 2);
	}

	pipe.positionBetween(point_a, point_b);

	this.scene.add(arrow);
	this.scene.add(pipe);

	return pipe;
};
