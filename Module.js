function Modules(assets) {
	var program = assets.getProgram('base');
	var modules = assets.getData('level.json').modules;

	var arrays = {};
	modules.forEach(function (module) {
		if (!arrays[module.path]) {
			var mesh = assets.getData(module.path);
			// TODO
		}
	});

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		for (var i = 0; i < modules.length; i++) {
			var module = modules[i];
			program.uniform2f('position', module.position.x, module.position.z);
			program.uniform1f('angle', module.angle);
			var arrays = arrays[module.path];
			arrays.enable();
			arrays.bindAndPointer();
			arrays.drawTriangles();
			arrays.disable();
		}
	};
}
