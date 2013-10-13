function Level(assets, modules) {
	var level = assets.getData('level.json');
	var descriptors = {
		'long': assets.getData('descriptors/long.json'),
		'short': assets.getData('descriptors/short.json'),
		'tee1': assets.getData('descriptors/tee1.json'),
		'tee2': assets.getData('descriptors/tee2.json'),
		'left': assets.getData('descriptors/left.json'),
		'right': assets.getData('descriptors/right.json')
	}

	var transforms = {};

	(function visit(id, position, angle) {
		transforms[id] = {
			position: position,
			angle: angle
		};
		level.modules[id].children.forEach(function (child, socket) {
			// TODO
		});
	})(level.root.id, level.root.position, 0);

	var program = assets.getProgram('base');

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		program.uniform2f('position', level.root.position.x, level.root.position.z);
		program.uniform1f('angle', 0);
		modules.draw(level.root.id);
	};
}
