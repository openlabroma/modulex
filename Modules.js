function Modules(assets) {
	var program = assets.getProgram('base');
	var modules = assets.getData('level.json').modules;

	function readArrays(mesh) {
		var count = 0;
		var vertices = [];
		var uvs = [];

		function pushVertex(index) {
			vertices.push(
				mesh.vertices[index * 3],
				mesh.vertices[index * 3 + 1],
				mesh.vertices[index * 3 + 2],
				1
				);
		}

		function pushUV(index) {
			uvs.push(
				mesh.uvs[index * 2],
				mesh.uvs[index * 2 + 1]
				);
		}

		var i = 0;
		while (i < mesh.faces.length) {
			var type = mesh.faces[i];
			if (type & 1) {
				pushVertex(mesh.faces[i + 1]);
				pushVertex(mesh.faces[i + 2]);
				pushVertex(mesh.faces[i + 3]);
				pushVertex(mesh.faces[i + 3]);
				pushVertex(mesh.faces[i + 4]);
				pushVertex(mesh.faces[i + 1]);
				i += 4;
				count += 6;
			} else {
				pushVertex(mesh.faces[i + 1]);
				pushVertex(mesh.faces[i + 2]);
				pushVertex(mesh.faces[i + 3]);
				i += 3;
				count += 3;
			}
			if (type & 2) {
				i++;
			}
			if (type & 4) {
				i++;
			}
			if (type & 8) {
				if (type & 1) {
					pushUV(mesh.faces[i + 1]);
					pushUV(mesh.faces[i + 2]);
					pushUV(mesh.faces[i + 3]);
					pushUV(mesh.faces[i + 3]);
					pushUV(mesh.faces[i + 4]);
					pushUV(mesh.faces[i + 1]);
					i += 4;
				} else {
					pushUV(mesh.faces[i + 1]);
					pushUV(mesh.faces[i + 2]);
					pushUV(mesh.faces[i + 3]);
					i += 3;
				}
			} else {
				if (type & 1) {
					uvs.push(0, 0, 0, 0, 0, 0);
				} else {
					uvs.push(0, 0, 0);
				}
			}
			if (type & 16) {
				i++;
			}
			if (type & 32) {
				if (type & 1) {
					i += 4;
				} else {
					i += 3;
				}
			}
			if (type & 64) {
				i++;
			}
			if (type & 128) {
				if (type & 1) {
					i += 4;
				} else {
					i += 3;
				}
			}
		}

		var arrays = new oogl.AttributeArrays(count);
		arrays.add4f(vertices);
		arrays.add2f(uvs);
		return arrays;
	}

	var arrayMap = {};
	modules.forEach(function (module) {
		if (!arrayMap[module.path]) {
			moduleArrays[module.path] = readArrays(assets.getData('modules/' + module.path));
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
			var arrays = arrayMap[module.path];
			arrays.enable();
			arrays.bindAndPointer();
			arrays.drawTriangles();
			arrays.disable();
		}
	};
}
