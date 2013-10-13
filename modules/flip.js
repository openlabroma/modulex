var data = require('./tee4.json');
for (var i = 2; i < data.vertices.length; i += 3) {
	data.vertices[i] *= -1;
}
for (var i = 2; i < data.normals.length; i += 3) {
	data.normals[i] *= -1;
}
require('fs').writeFileSync('tee4.json', JSON.stringify(data));
