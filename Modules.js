function Modules(assets) {
	var level = assets.getData('level.json');

	function readArrays(mesh, materialIndex) {
		var count = 0;
		var vertices = [];
		var normals = [];
		var uvs = [];

		function pushVertex(array, index) {
			array.push(
				mesh.vertices[index * 3],
				mesh.vertices[index * 3 + 1],
				mesh.vertices[index * 3 + 2],
				1
				);
		}

		var push = false;

		function pushNormal(index) {
			if (push) {
				normals.push(
					mesh.normals[index * 3],
					mesh.normals[index * 3 + 1],
					mesh.normals[index * 3 + 2]
					);
			}
		}

		function pushUV(index) {
			if (push) {
				uvs.push(
					mesh.uvs[0][index * 2],
					mesh.uvs[0][index * 2 + 1]
					);
			}
		}

		for (var i = 0; i < mesh.faces.length; i++) {
			var type = mesh.faces[i];
			var currentVertices = [];
			if (type & 1) {
				pushVertex(currentVertices, mesh.faces[i + 1]);
				pushVertex(currentVertices, mesh.faces[i + 2]);
				pushVertex(currentVertices, mesh.faces[i + 3]);
				pushVertex(currentVertices, mesh.faces[i + 3]);
				pushVertex(currentVertices, mesh.faces[i + 4]);
				pushVertex(currentVertices, mesh.faces[i + 1]);
				count += 6;
				i += 4;
			} else {
				pushVertex(currentVertices, mesh.faces[i + 1]);
				pushVertex(currentVertices, mesh.faces[i + 2]);
				pushVertex(currentVertices, mesh.faces[i + 3]);
				count += 3;
				i += 3;
			}
			if (type & 2) {
				push = (mesh.faces[++i] == materialIndex);
			} else {
				push = !materialIndex;
			}
			if (push) {
				vertices.push.call(vertices, currentVertices);
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
			} else {
				if (type & 1) {
					normals.push(
						0, 0, 0,
						0, 0, 0,
						0, 0, 0,
						0, 0, 0,
						0, 0, 0,
						0, 0, 0
						);
				} else {
					normals.push(
						0, 0, 0,
						0, 0, 0,
						0, 0, 0
						);
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
			arrayMap[module.type] = {
				walls: readArrays(assets.getData('modules/' + module.type + '.json'), 0),
				frames: readArrays(assets.getData('modules/' + module.type + '.json'), 2),
				glasses: readArrays(assets.getData('modules/' + module.type + '.json'), 1),
			};
		}
	}

	function bindDraw(arrayName) {
		return function (id) {
			var arrays = arrayMap[level.modules[id].type][arrayName];
			arrays.enable();
			arrays.bindAndPointer();
			arrays.drawTriangles();
			arrays.disable();
		};
	}

	this.drawWalls = bindDraw('walls');
	this.drawFrames = bindDraw('frames');
	this.drawGlasses= bindDraw('glasses');
}
