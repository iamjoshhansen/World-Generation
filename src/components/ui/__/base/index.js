module.exports = Base;

function Base () {

	this.pm = {
		x: 0,
		y: 0,
		z: 0
	};

	this.rm = {
		x: 0,
		y: 0,
		z: 0
	};

}

_.extend(Base.prototype, {

	step: function () {

		this.mesh.position.x += this.pm.x;
		this.mesh.position.y += this.pm.y;
		this.mesh.position.z += this.pm.z;

		this.mesh.rotateX(this.rm.x);
		this.mesh.rotateY(this.rm.y);
		this.mesh.rotateZ(this.rm.z);

	}

});
