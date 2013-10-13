function Modules(assets) {
	var level = assets.getData('level.json');

	function readArrays(mesh) {
		var count = 0;
		var vertices = [];
		var normals = [];
		var uvs = [];

		function pushVertex(index) {
			vertices.push(
				mesh.vertices[index * 3],
				mesh.vertices[index * 3 + 1],
				mesh.vertices[index * 3 + 2],
				1
				);
		}

		function pushNormal(index) {
			normals.push(
				mesh.normals[index * 3],
				mesh.normals[index * 3 + 1],
				mesh.normals[index * 3 + 2]
				);
		}

		function pushUV(index) {
			uvs.push(
				mesh.uvs[index * 2],
				mesh.uvs[index * 2 + 1]
				);
		}

		for (var i = 0; i < mesh.faces.length; i++) {
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
					uvs.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
				} else {
					uvs.push(0, 0, 0, 0, 0, 0);
				}
			}
			if (type & 16) {
				i++;
			}
			if (type & 32) {
				if (type & 1) {
					pushNormal(mesh.faces[i + 1]);
					pushNormal(mesh.faces[i + 2]);
					pushNormal(mesh.faces[i + 3]);
					pushNormal(mesh.faces[i + 3]);
					pushNormal(mesh.faces[i + 4]);
					pushNormal(mesh.faces[i + 1]);
					i += 4;
				} else {
					pushNormal(mesh.faces[i + 1]);
					pushNormal(mesh.faces[i + 2]);
					pushNormal(mesh.faces[i + 3]);
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
		arrays.add3f(normals);
		arrays.add2f(uvs);
		return arrays;
	}

	var arrayMap = {};
	for (var id in level.modules) {
		var module = level.modules[id];
		if (!arrayMap[module.type]) {
			arrayMap[module.type] = readArrays(assets.getData('modules/' + module.type + '.json'));
		}
	}

	this.draw = function (id) {
		var arrays = arrayMap[level.modules[id].type];
		arrays.enable();
		arrays.bindAndPointer();
		arrays.drawTriangles();
		arrays.disable();
	};
}
