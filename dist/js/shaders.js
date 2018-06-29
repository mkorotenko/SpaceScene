//In the vertex shader
// "uniform mat4 modelMatrix;",//uNormalMatrix
// "uniform mat4 modelViewMatrix;",//uMVMatrix
// "uniform mat4 projectionMatrix;",//uPMatrix
// "uniform mat4 viewMatrix;",//uVMatrix
// "uniform mat3 normalMatrix;",
// "uniform vec3 cameraPosition;",
//attribute vec3 position;//vPos
//attribute vec3 normal;//objectNormal
//attribute vec2 uv;
//http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
module.exports = {
    fs: `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
    precision highp int;

    #define PI 3.14159265359
    #define RECIPROCAL_PI 0.31830988618

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

    //uniform vec3 diffuse;
    //uniform vec3 emissive;
    //uniform vec3 specular;
    //uniform float shininess;
    //uniform float opacity;

    uniform sampler2D map;
    uniform sampler2D emissiveMap;
    uniform sampler2D specularMap;
    uniform sampler2D normalMap;
    //uniform vec2 normalScale;

    uniform vec3 ambientLightColor;
    uniform PointLight pointLights[ 1 ];

    uniform vec3 lightPosition;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    float pow2( const in float x ) { return x*x; }
    float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
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
        //vec3 lVector = lightPosition - geometry.position;
        directLight.direction = normalize( lVector );
        float lightDistance = length( lVector );
        directLight.color = vec3( 1.0 );//pointLight.color;
        //directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
        directLight.color *= min(1.0, 1.0 / (0.3 + 0.007 * lightDistance + 0.00008 * lightDistance * lightDistance));
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
        float scale = sign( st1.t * st0.s - st0.t * st1.s );		
        scale *= float( gl_FrontFacing ) * 2.0 - 1.0;
        vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
        vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
        vec3 N = normalize( surf_norm );
        vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
        //mapN.xy = normalScale * mapN.xy;
        mat3 tsn = mat3( S, T, N );
        return normalize( tsn * mapN );
    }

    void main() {

        vec4 texelColor = texture2D( map, vUv );

        //vec4 diffuseColor = vec4( diffuse, 1.0);//opacity );
        //diffuseColor *= texelColor;
        vec4 diffuseColor = texelColor;

        //vec3 lightVectorW = normalize(lightPosition - vPositionW);
        //float lightDiffuse = clamp(dot(vNormalW, lightVectorW),0.015,1.0);

         float specularStrength;

         vec4 texelSpecular = texture2D( specularMap, vUv );
         specularStrength = texelSpecular.r;

        vec3 normal = normalize( vNormal );

        normal = perturbNormal2Arb( -vViewPosition, normal );

         BlinnPhongMaterial material;
         material.diffuseColor = diffuseColor.rgb;
         //material.specularColor = specular;
         material.specularColor = vec3( 1.0 );
         //material.specularShininess = shininess;
         material.specularShininess = 1.0;
         material.specularStrength = specularStrength;

        GeometricContext geometry;
        geometry.position = vPositionW;
        geometry.normal = vNormalW;//normal;
        geometry.viewDir = normalize( vPositionW );
        IncidentLight directLight;

        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

         PointLight pointLight;
         pointLight = pointLights[ 0 ];

         getPointDirectLightIrradiance( pointLight, geometry, directLight );
         RE_Direct_BlinnPhong( directLight, geometry, material, reflectedLight );
            
        // vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
        // RE_IndirectDiffuse_BlinnPhong( irradiance, geometry, material, reflectedLight );

        // //vec3 totalEmissiveRadiance = emissive;
        vec3 totalEmissiveRadiance = vec3( 1.0 );
        vec4 emissiveColor = texture2D( emissiveMap, vUv );
        float lightDiffuse = clamp(dot(vNormalW, directLight.direction)+0.1,0.0,1.0);
        totalEmissiveRadiance *= emissiveColor.rgb * pow((1.0 - lightDiffuse), 8.0);

        //(nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0))
        //diffuseColor.rgb*lightDiffuse + 
        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

        gl_FragColor = vec4( outgoingLight, diffuseColor.a );

    }
    `,
    vs4: `
    precision highp float;
    precision highp int;

    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

    void main() {

        vec3 transformedNormal = normalMatrix * normal;
        vNormal = normalize( transformedNormal );

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vViewPosition = - mvPosition.xyz;

        vUV = uv;

        gl_Position = projectionMatrix * mvPosition;

    }
    `,
// In the fragment shader
// "uniform mat4 viewMatrix;",
// "uniform vec3 cameraPosition;",
    fs4: `
    precision mediump int;
    precision mediump float;

    // Varying
    varying vec2 vUV;
    varying vec3 vViewPosition;
    varying vec3 vNormal;

    // Refs
    uniform vec3 lightPosition;
    uniform sampler2D diffuseTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D normalTexture;
    
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    void main(void) {
        vec3 lightVectorW = normalize(lightPosition - vViewPosition);
    
        vec3 normal = 2.0 * texture2D (normalTexture, vUV).rgb - 1.0;
        normal = normalize (normal);

        // diffuse
        float lightDiffuse = clamp(dot(vNormal, lightVectorW),0.015,1.0);
        float shininess = clamp(dot(normal, lightVectorW),0.01,1.0);
        float specular = 0.0;

        vec3 color;
        vec4 nightColor = texture2D(nightTexture, vUV).rgba;
        vec3 diffuseColor = texture2D(diffuseTexture, vUV).rgb;
    
        color = specular * specColor + (1.0-shininess) * diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
        gl_FragColor = vec4(color, 1.0);
    }
    `,
    vs: `
    precision highp float;
    precision highp int;

    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main() {

        vec3 transformedNormal = normalMatrix * normal;
        vNormal = normalize( transformedNormal );

        vec4 positionW = vec4( position, 1.0 );
        vPositionW = vec3(modelMatrix * positionW);

        vUv = uv;

        vec4 mvPosition = modelViewMatrix * positionW;
        gl_Position = projectionMatrix * mvPosition;

        vViewPosition = - mvPosition.xyz;
        vNormalW = normalize(vec3(modelMatrix * vec4(normal, 0.0)));

    }
    `,
    vs3: `
    precision highp float;
    precision highp int;

    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {

        vec3 transformedNormal = normalMatrix * normal;
        vNormal = normalize( transformedNormal );

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vViewPosition = - mvPosition.xyz;

        vUv = uv;

        gl_Position = projectionMatrix * mvPosition;

    }
    `,
    vs2: `
    precision mediump int;
    precision mediump float;

    uniform vec3 lightPosition;

    // Varying
    varying vec2 vUv;
    varying vec3 vPositionW;
    varying vec3 vNormal;

    void main(void) {

        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
        vNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    }
    `,
// In the fragment shader
// "uniform mat4 viewMatrix;",
// "uniform vec3 cameraPosition;",
    fs2: `
    precision mediump int;
    precision mediump float;

    // Varying
    varying vec2 vUv;
    varying vec3 vPositionW;
    varying vec3 vNormal;

    // Refs
    uniform vec3 lightPosition;
    uniform sampler2D map;
    uniform sampler2D specularMap;
    uniform sampler2D normalMap;
    
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    void main(void) {
        vec3 lightVectorW = normalize(lightPosition - vPositionW);
    
        vec3 normal = 2.0 * texture2D (normalMap, vUv).rgb - 1.0;
        normal = normalize (normal);

        // diffuse
        float lightDiffuse = clamp(dot(vNormal, lightVectorW),0.015,1.0);
        float shininess = clamp(dot(normal, lightVectorW),0.01,1.0);
        float specular = 0.0;

        vec3 color;
        vec4 nightColor = texture2D(specularMap, vUv).rgba;
        vec3 diffuseColor = texture2D(map, vUv).rgb;
    
        color = specular * specColor + (1.0-shininess) * diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
        gl_FragColor = vec4(color, 1.0);
    }
    `,
    vs1: `
    precision highp float;

    // Varying
    varying vec2 vUv;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main(void) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
        vNormalW = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vUv = uv;
    }
    `,
    fs1: `
    precision highp float;

    // Varying
    varying vec2 vUv;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    
    // Refs
    uniform vec3 lightPosition;
    uniform sampler2D map;
    uniform sampler2D specularMap;
    
    void main(void) {
        vec3 direction = lightPosition - vPositionW;
        vec3 lightVectorW = normalize(direction);
    
        // diffuse
        float lightDiffuse = max(0.05, dot(vNormalW, lightVectorW));
    
        vec3 color;
        vec4 nightColor = texture2D(specularMap, vUv).rgba;
        vec3 diffuseColor = texture2D(map, vUv).rgb;
    
        color = diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
        gl_FragColor = vec4(color, 1.0);
    }
    `,
}