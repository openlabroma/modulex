precision mediump float;

uniform float screenRatio;

uniform struct {
	vec2 position;
	vec2 angle;
} camera;

uniform mat4 transform;
uniform float angle;

attribute vec4 vertex;
attribute vec3 normal;
attribute vec2 texCoord;

varying vec4 vertNormal;
varying vec2 vertTexCoord;

void main() {
	gl_Position = mat4(
		1, 0, 0, 0,
		0, screenRatio, 0, 0,
		0, 0, 0, 1,
		0, 0, 1, 1
	) * mat4(
		1, 0, 0, 0,
		0, cos(camera.angle.x), -sin(camera.angle.x), 0,
		0, sin(camera.angle.x), cos(camera.angle.x), 0,
		0, 0, 0, 1
	) * mat4(
		cos(camera.angle.y), 0, -sin(camera.angle.y), 0,
		0, 1, 0, 0,
		sin(camera.angle.y), 0, cos(camera.angle.y), 0,
		0, 0, 0, 1
	) * mat4(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		-camera.position.x, -90, -camera.position.y, 1
	) * transform * vertex;

	vertNormal = mat4(
		cos(angle), 0, sin(angle), 0,
		0, 1, 0, 0,
		-sin(angle), 0, cos(angle), 0,
		0, 0, 0, 1
	) * vec4(normal, 1);

	vertTexCoord = vec2(texCoord.x, 1.0 - texCoord.y);
}
