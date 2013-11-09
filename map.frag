precision mediump float;

uniform int moduleId;

void main() {
	gl_FragColor = vec4(vec3(float(moduleId) / 64.0), 1);
}
