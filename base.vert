precision mediump float;

uniform float screenRatio;

uniform struct {
	vec2 position;
	vec2 angle;
} camera;

uniform vec2 position;
uniform float angle;

attribute vec4 vertex;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec3 vertNormal;
varying vec2 vertTexCoord;

void main() {
	gl_Position = mat4(
		1, 0, 0, 0,
		0, screenRatio, 0, 0,
		0, 0, 0, 1,
		0, 0, 1, 1
	) * mat4(
		cos(camera.angle.y), 0, -sin(camera.angle.y), 0,
		0, 1, 0, 0,
		sin(camera.angle.y), 0, cos(camera.angle.y), 0,
		0, 0, 0, 1
	) * mat4(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		-camera.position.x, -15.5, -camera.position.y, 1
	) * mat4(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		position.x, 0, position.y, 1
	) * mat4(
		cos(angle), 0, sin(angle), 0,
		0, 1, 0, 0,
		-sin(angle), 0, cos(angle), 0,
		0, 0, 0, 1
	) * vertex;
	vertNormal = normal;
	vertTexCoord = texCoord;
}
