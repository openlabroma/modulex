function Marker(assets) {
	var program = assets.getProgram('marker');

	var arrays = new oogl.AttributeArrays(6);
	arrays.add4f([
		1, 0, 0, 1,
		1, 1, 0, 0,
		0, 1, 1, 0,
		0, 1, 1, 0,
		0, 0, 1, 1,
		1, 0, 0, 1
	]);

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		program.uniform2f('v1', -140, -210);
		program.uniform2f('v2', 330, 260);
		arrays.enable();
		arrays.bindAndPointer();
		arrays.drawTriangles();
		arrays.disable();
	};
}
