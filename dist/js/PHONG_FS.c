#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define GAMMA_FACTOR 2
#define USE_MAP
#define USE_NORMALMAP
#define USE_SPECULARMAP
#define PHONG

#define PI 3.14159265359
#define RECIPROCAL_PI 0.31830988618
#define saturate(a) clamp( a, 0.0, 1.0 )

float pow2( const in float x ) { return x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
struct PointLight {
	vec3 position;
	vec3 color;
	float distance;
	float decay;
	int shadow;
	float shadowBias;
	float shadowRadius;
	vec2 shadowMapSize;
	float shadowCameraNear;
	float shadowCameraFar;
};
struct BlinnPhongMaterial {
	vec3	diffuseColor;
	vec3	specularColor;
	float	specularShininess;
	float	specularStrength;
};

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

uniform sampler2D map;
uniform sampler2D emissiveMap;
uniform sampler2D specularMap;
uniform sampler2D normalMap;
uniform vec2 normalScale;

uniform vec3 ambientLightColor;
uniform PointLight pointLights[ 1 ];

float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	if( decayExponent > 0.0 ) {
		#if defined ( PHYSICALLY_CORRECT_LIGHTS )
				float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
				float maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
				return distanceFalloff * maxDistanceCutoffFactor;
		#else
				return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
		#endif
	}
	return 1.0;
}
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	vec3 F = ( 1.0 - specularColor ) * fresnel + specularColor;
	float G = 0.25;
	float D = RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
	return F * ( G * D );
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	return irradiance;
}
void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
	vec3 lVector = pointLight.position - geometry.position;
	directLight.direction = normalize( lVector );
	float lightDistance = length( lVector );
	directLight.color = pointLight.color;
	directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
	directLight.visible = ( directLight.color != vec3( 0.0 ) );
}
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

		float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
		vec3 irradiance = dotNL * directLight.color;

	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * RECIPROCAL_PI * material.diffuseColor;
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * RECIPROCAL_PI * material.diffuseColor;
}
vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
	vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
	vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
	vec2 st0 = dFdx( vUv.st );
	vec2 st1 = dFdy( vUv.st );
	float scale = sign( st1.t * st0.s - st0.t * st1.s );		scale *= float( gl_FrontFacing ) * 2.0 - 1.0;
	vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
	vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
	vec3 N = normalize( surf_norm );
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy = normalScale * mapN.xy;
	mat3 tsn = mat3( S, T, N );
	return normalize( tsn * mapN );
}

void main() {

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	vec4 texelColor = texture2D( map, vUv );
	diffuseColor *= texelColor;

	float specularStrength;

	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;

	vec3 normal = normalize( vNormal );

	normal = perturbNormal2Arb( -vViewPosition, normal );

	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	totalEmissiveRadiance *= emissiveColor.rgb;

	BlinnPhongMaterial material;
	material.diffuseColor = diffuseColor.rgb;
	material.specularColor = specular;
	material.specularShininess = shininess;
	material.specularStrength = specularStrength;

	GeometricContext geometry;
	geometry.position = - vViewPosition;
	geometry.normal = normal;
	geometry.viewDir = normalize( vViewPosition );
	IncidentLight directLight;

	PointLight pointLight;
	pointLight = pointLights[ 0 ];
	getPointDirectLightIrradiance( pointLight, geometry, directLight );
	RE_Direct_BlinnPhong( directLight, geometry, material, reflectedLight );
		
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	RE_IndirectDiffuse_BlinnPhong( irradiance, geometry, material, reflectedLight );

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );

}
