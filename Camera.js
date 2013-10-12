function Camera() {
	var position = {
		x: 0,
		z: 0
	};
	var angle = {
		x: 0,
		y: 0
	};

	var keys = {
		left: false,
		right: false,
		up: false,
		down: false,
		leftStrafe: false,
		rightStrafe: false
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
	this.startStrafeLeft = function () {
		keys.leftStrafe = true;
	};
	this.stopStrafeLeft = function () {
		keys.leftStrafe = false;
	};
	this.startStrafeRight = function () {
		keys.rightStrafe = true;
	};
	this.stopStrafeRight = function () {
		keys.rightStrafe = false;
	};

	var walkVelocity = 75;
	var turnVelocity = Math.PI;

	this.rotate = function (dx, dy) {
		angle.x += dx * turnVelocity;
		angle.y += dy * turnVelocity;
	};
	this.resetAngle = function () {
		angle.x = 0;
	};

	this.tick = function (dt) {
		dt /= 1000;
		var ds = walkVelocity * dt;
		var da = turnVelocity * dt;

		var dx = 0;
		var dz = 0;

		if (keys.up) {
			dx += ds * -Math.sin(angle.y);
			dz += ds * Math.cos(angle.y);
		}
		if (keys.down) {
			dx -= ds * -Math.sin(angle.y);
			dz -= ds * Math.cos(angle.y);
		}
		if (keys.left) {
			angle.y += da;
		}
		if (keys.right) {
			angle.y -= da;
		}
		if (keys.leftStrafe) {
			dx += ds * -Math.sin(angle.y + Math.PI / 2);
			dz += ds * Math.cos(angle.y + Math.PI / 2);
		}
		if (keys.rightStrafe) {
			dx += ds * -Math.sin(angle.y - Math.PI / 2);
			dz += ds * Math.cos(angle.y - Math.PI / 2);
		}

		position.x += dx;
		position.z += dz;
	};

	this.uniform = function (program) {
		program.uniform2f('camera.position', position.x, position.z);
		program.uniform2f('camera.angle', angle.x, angle.y);
	};
}
