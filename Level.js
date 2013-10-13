function Level(assets, modules) {
	var level = assets.getData('level.json');
	var program = assets.getProgram('base');

	var transforms = {};

	(function visit(id, position, angle) {
		transforms[id] = {
			position: position,
			angle: angle
		};
		level.modules[id].children.forEach(function (neighbor) {
			// TODO
		});
	})(level.root.id, level.root.position, 0);

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		program.uniform2f('position', level.root.position.x, level.root.position.z);
		program.uniform1f('angle', 0);
		modules.draw(level.root.id);
	};
}
