precision highp float;
precision highp int;

uniform int moduleId;

void main() {
	gl_FragColor = vec4(vec3(
		mod(float(moduleId), 15.0),
		mod(float(moduleId), 255.0) / 16.0,
		mod(float(moduleId), 4095.0) / 256.0
		) / 15.0, 1);
}
