precision mediump float;

uniform sampler2D texture;

varying vec4 vertNormal;
varying vec2 vertTexCoord;

void main() {
	vec3 normal = vec3(vertNormal) / vertNormal.w;
	float brightness = acos(dot(normal, normalize(vec3(1, -1, 1)))) / acos(-1.0);
	gl_FragColor = vec4(vec3(texture2D(texture, vertTexCoord)) * vec3(0, 1, 1) * brightness, 0.2);
}
