function Marker(assets) {
	var program = assets.getProgram('marker');

	var arrays = new oogl.AttributeArrays(6);
	arrays.add4f([
		0, 150, 0, 1,
		0, 0, 0, 1,
		100, 0, 0, 1,
		100, 0, 0, 1,
		100, 150, 0, 1,
		0, 150, 0, 1
	]);

	this.draw = function (camera) {
		program.use();
		program.uniform1f('screenRatio', width / height);
		camera.uniform(program);
		program.uniform2f('position', 0, 0);
		program.uniform1f('angle', 0);
		arrays.enable();
		arrays.bindAndPointer();
		arrays.drawTriangles();
		arrays.disable();
	};
}
