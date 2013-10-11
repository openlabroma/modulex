function Camera() {
	var position = {
		x: 0,
		z: 0
	};

	var angle = 0;

	this.uniform = function (program) {
		program.uniform2f('camera.position', position.x, position.z);
		program.uniform1f('camera.angle', angle);
	};
}
