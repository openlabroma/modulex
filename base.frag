precision mediump float;

uniform sampler2D texture;

varying vec3 vertNormal;
varying vec2 vertTexCoord;

void main() {
	float brightness = acos(dot(vertNormal, normalize(vec3(1, -1, 1)))) / acos(-1.0);
	gl_FragColor = vec4(vec3(1) * brightness, 1);
}
