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

	var baseProgram = assets.getProgram('base');
	var glassProgram = assets.getProgram('glass');
	var wallTexture = assets.getTexture('walls.png');
	var frameTexture = assets.getTexture('frame.png');

	function drawModule(program, id, component) {
		program.uniformMat4('transform', transforms[id].transform);
		program.uniform1f('angle', transforms[id].angle);
		//program.uniformMat4('transform', OOGL.Matrix4.IDENTITY);
		//program.uniform1f('angle', 0);
		modules.draw(id, component);
	}

	function drawModules(camera, program, component) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		drawModule(program, 2, component);
		drawModule(program, 3, component);
		drawModule(program, 4, component);
		drawModule(program, 5, component);
		drawModule(program, 6, component);
		drawModule(program, 7, component);
		drawModule(program, 9, component);
		drawModule(program, 10, component);
		drawModule(program, 11, component);
		drawModule(program, 12, component);
		drawModule(program, 13, component);
		drawModule(program, 14, component);
		drawModule(program, 15, component);
		drawModule(program, 16, component);
		drawModule(program, 17, component);
		drawModule(program, 18, component);
		drawModule(program, 19, component);
		drawModule(program, 20, component);
		drawModule(program, 21, component);
		drawModule(program, 22, component);
		drawModule(program, 23, component);
		drawModule(program, 31, component);
	}

	this.draw = function (camera) {
		frameTexture.bind();
		drawModules(camera, baseProgram, 'frames');
		wallTexture.bind();
		drawModules(camera, baseProgram, 'walls');
		drawModules(camera, glassProgram, 'glasses');
	};
}
