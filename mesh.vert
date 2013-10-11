precision mediump float;

uniform float fScreenRatio;

attribute vec3 in_Vertex;

void main() {
	gl_Position = mat4(
		1, 0, 0, 0,
		0, fScreenRatio, 0, 0,
		0, 0, 0, 1,
		0, 0, 1, 1
	) * vec4(in_Vertex, 1);
}
