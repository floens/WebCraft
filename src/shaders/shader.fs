precision highp float;

varying vec3 vColor;
varying vec2 vTexture;

uniform sampler2D uSampler;

void main() {
	gl_FragColor = texture2D(uSampler, vTexture) * vec4(vColor, 1.0);
}