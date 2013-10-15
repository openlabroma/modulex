function Level(assets, modules) {
	var level = assets.getData('level.json');
	var descriptors = {
		'long': assets.getData('descriptors/long.json'),
		'short': assets.getData('descriptors/short.json'),
		'tee1': assets.getData('descriptors/tee1.json'),
		'tee2': assets.getData('descriptors/tee2.json'),
		'tee3': assets.getData('descriptors/tee3.json'),
		'tee4': assets.getData('descriptors/tee4.json'),
		'left': assets.getData('descriptors/left.json'),
		'right': assets.getData('descriptors/right.json')
	}

	var transforms = {};

	(function visit(id, transform, angle, plugIndex) {
		var module = level.modules[id];
		var descriptor = descriptors[module.type];
		var plug = descriptor.sockets[plugIndex];
		transform.multiply(new OOGL.YRotationMatrix4(plug.angle));
		transform.multiply(new OOGL.TranslationMatrix4(-plug.position.x, 0, -plug.position.z));
		angle -= plug.angle;
		transforms[id] = {
			transform: transform,
			angle: angle
		};
		for (var socketIndex in module.children) {
			var child = module.children[socketIndex];
			var socket = descriptor.sockets[socketIndex];
			visit(child.id,	transform
				.by(new OOGL.TranslationMatrix4(socket.position.x, 0, socket.position.z))
				.by(new OOGL.YRotationMatrix4(-socket.angle)), angle + socket.angle, child.plug);
		}
	})(level.root.id, OOGL.Matrix4.IDENTITY.clone(), 0, 0);

	var program = assets.getProgram('base');
	var texture = assets.getTexture('texture.png');

	function drawModule(id, flat) {
		program.uniformMat4('transform', transforms[id].transform);
		program.uniform1f('angle', transforms[id].angle);
		modules.draw(id, flat);
	}

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		drawModule(2);
		drawModule(3);
		drawModule(4);
		drawModule(5);
		drawModule(6);
		drawModule(7);
		drawModule(8);
		drawModule(9);
		drawModule(10);
	};
}
