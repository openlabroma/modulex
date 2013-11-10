precision highp float;
precision highp int;

uniform mat4 transform;
uniform vec4 area;

uniform int moduleId;
uniform int moduleCount;

attribute vec4 vertex;

void main() {
	vec4 transformed = transform * vertex;
	vec2 normalized = vec2(transformed.x, transformed.z);
	normalized.x = (normalized.x - area[0]) * 2.0 / (area[2] - area[0]) - 1.0;
	normalized.y = (normalized.y - area[1]) * 2.0 / (area[3] - area[1]) - 1.0;
	gl_Position = vec4(normalized, float(moduleId) / float(moduleCount), 1);
}
