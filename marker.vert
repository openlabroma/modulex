precision mediump float;

uniform float screenRatio;

uniform struct {
	vec2 position;
	vec2 angle;
} camera;

uniform vec2 v1;
uniform vec2 v2;

attribute vec4 vertex;

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
	) * vec4(
		v1.x * vertex.x + v2.x * vertex.z,
		50,
		v1.y * vertex.y + v2.y * vertex.w,
		1
		);
}
