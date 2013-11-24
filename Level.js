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
		'right': assets.getData('descriptors/right.json'),
		'room': assets.getData('descriptors/room.json')
	}

	var transforms = {};
	var area = [0, 0, 0, 0];

	function updateArea(descriptor, transform) {
		var v0 = transform.by(new OOGL.Vector4(descriptor.area.x0, 0, descriptor.area.z0, 1)).toStandard();
		var v1 = transform.by(new OOGL.Vector4(descriptor.area.x1, 0, descriptor.area.z1, 1)).toStandard();
		area[0] = Math.min(area[0], v0.x, v1.x);
		area[1] = Math.min(area[1], v0.z, v1.z);
		area[2] = Math.max(area[2], v0.x, v1.x);
		area[3] = Math.max(area[3], v0.z, v1.z);
	}

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
		updateArea(descriptor, transform);
		for (var socketIndex in module.children) {
			var child = module.children[socketIndex];
			var socket = descriptor.sockets[socketIndex];
			visit(child.id,	transform
				.by(new OOGL.TranslationMatrix4(socket.position.x, 0, socket.position.z))
				.by(new OOGL.YRotationMatrix4(-socket.angle)), angle + socket.angle, child.plug);
		}
	})(level.root.id, OOGL.Matrix4.IDENTITY.clone(), 0, 0);

	var programs = {
		base: assets.getProgram('base'),
		glass: assets.getProgram('glass')
	};
	var textures = (function (names) {
		var textures = {};
		names.forEach(function (name) {
			textures[name + '.png'] = assets.getTexture(name + '.png');
		});
		return textures;
	})(['walls', 'frame', 'room1', 'room2', 'room3', 'door']);

	var map = new (function (width, height) {
		var program = assets.getProgram('map');
		program.use();
		program.uniform1i('moduleCount', Object.keys(transforms).length);
		program.uniform4fv('area', area);

		var renderbuffer = new oogl.Renderbuffer();
		renderbuffer.bind();
		renderbuffer.storage(oogl.RGBA4, width, height);
		var framebuffer = new oogl.Framebuffer();
		framebuffer.bind();
		framebuffer.renderbuffer(oogl.COLOR_ATTACHMENT0, renderbuffer);

		oogl.disable(oogl.DEPTH_TEST);
		oogl.viewport(0, 0, width, height);
		oogl.clear(oogl.COLOR_BUFFER_BIT | oogl.DEPTH_BUFFER_BIT);

		function drawModules(component) {
			for (var id in transforms) {
				program.uniform1i('moduleId', parseInt(id, 10));
				program.uniformMat4('transform', transforms[id].transform);
				modules.draw(id, component);
			}
		}

		drawModules('walls');
		drawModules('frames');
		drawModules('glasses');

		oogl.flush();

		var pixels = new Uint8Array(width * height * 4);
		oogl.readPixels(0, 0, width, height, oogl.RGBA, oogl.UNSIGNED_BYTE, pixels);
		framebuffer._delete();

		oogl.enable(oogl.DEPTH_TEST);

		this.getModuleId = function (x, z) {
			x = Math.floor((x - area[0]) * width / (area[2] - area[0]));
			z = Math.floor((z - area[1]) * height / (area[3] - area[1]));
			var offset = (z * width + x) * 4;
			if ((offset >= 0) && (offset < width * height * 4)) {
				var red = Math.floor(pixels[offset] / 16);
				var green = Math.floor(pixels[offset + 1] / 16);
				var blue = Math.floor(pixels[offset + 2] / 16);
				return red + (green << 4) + (blue << 8);
			} else {
				return -1;
			}
		};
	})(512, 512);

	function drawModule(program, moduleId, componentId) {
		program.uniformMat4('transform', transforms[moduleId].transform);
		program.uniform1f('angle', transforms[moduleId].angle);
		modules.draw(moduleId, componentId);
	}

	function drawModules(camera, componentId, programName, textureName) {
		textures[textureName].bind();
		var program = programs[programName];
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		drawModule(program, 1, componentId);
		//var moduleId = map.getModuleId(camera.getX(), camera.getZ());
		//if (moduleId in transforms) {
		//	drawModule(program, moduleId, componentId);
		//	var mates = level.modules[moduleId].mates;
		//	for (var i = 0; i < mates.length; i++) {
		//		drawModule(program, mates[i], componentId);
		//	}
		//}
	}

	this.draw = function (camera) {
		modules.forEachComponent(function (componentId, programName, textureName) {
			if (programName != 'glass') {
				drawModules(camera, componentId, programName, textureName);
			}
		});
		modules.forEachComponent(function (programName, textureName) {
			if (programName == 'glass') {
				drawModules(camera, componentId, programName, textureName);
			}
		});
	};
}
