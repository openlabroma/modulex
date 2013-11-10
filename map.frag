precision highp float;
precision highp int;

uniform int moduleId;

void main() {
	gl_FragColor = vec4(vec3(
		mod(float(moduleId), 16.0),
		mod(float(moduleId), 256.0) / 16.0,
		mod(float(moduleId), 4096.0) / 256.0
		) / 15.0, 1);
}
