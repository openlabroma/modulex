function Camera() {
	var position = {
		x: 0,
		z: 0
	};

	var angle = 0;

	var keys = {
		left: false,
		right: false,
		up: false,
		down: false
	};

	this.startLeft = function () {
		keys.left = true;
	};
	this.stopLeft = function () {
		keys.left = false;
	};
	this.startRight= function () {
		keys.right = true;
	};
	this.stopRight= function () {
		keys.right = false;
	};
	this.startUp = function () {
		keys.up = true;
	};
	this.stopUp = function () {
		keys.up = false;
	};
	this.startDown = function () {
		keys.down = true;
	};
	this.stopDown = function () {
		keys.down = false;
	};

	var walkVelocity = 0.5;
	var turnVelocity = Math.PI / 2;

	this.tick = function (dt) {
		dt /= 1000;
		var ds = walkVelocity * dt;
		var da = turnVelocity * dt;

		var dx = 0;
		var dz = 0;

		if (keys.up) {
			dx += ds * -Math.sin(angle);
			dz += ds * Math.cos(angle);
		}
		if (keys.down) {
			dx -= ds * -Math.sin(angle);
			dz -= ds * Math.cos(angle);
		}
		if (keys.left) {
			angle += da;
		}
		if (keys.right) {
			angle -= da;
		}
	};

	this.uniform = function (program) {
		program.uniform2f('camera.position', position.x, position.z);
		program.uniform1f('camera.angle', angle);
	};
}
