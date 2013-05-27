attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec2 aTexture;

uniform mat4 mView;
uniform mat4 mProj;

varying vec3 vColor;
varying vec2 vTexture;

void main() {
	vColor = aColor;
	vTexture = aTexture;
	gl_Position = mProj * mView * vec4(aPosition, 1.0);
}