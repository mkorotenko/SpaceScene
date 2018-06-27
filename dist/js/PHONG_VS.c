precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define USE_MAP
#define USE_NORMALMAP
#define USE_SPECULARMAP

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform mat3 uvTransform;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

	vec3 objectNormal = vec3( normal );

	vec3 transformedNormal = normalMatrix * objectNormal;

	vNormal = normalize( transformedNormal );

	vec3 transformed = vec3( position );

	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	vViewPosition = - mvPosition.xyz;
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

}