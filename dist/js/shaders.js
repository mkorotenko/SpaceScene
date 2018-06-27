//In the vertex shader
// "uniform mat4 modelMatrix;",//uNormalMatrix
// "uniform mat4 modelViewMatrix;",//uMVMatrix
// "uniform mat4 projectionMatrix;",//uPMatrix
// "uniform mat4 viewMatrix;",//uVMatrix
// "uniform mat3 normalMatrix;",
// "uniform vec3 cameraPosition;",
//attribute vec3 position;//vPos
//attribute vec3 normal;//normals
//attribute vec2 uv;
//http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
module.exports = {
    vs: `
    precision highp float;
    precision highp int;

    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

    void main() {

        vUV = uv;

        vec3 objectNormal = vec3( normal );

        vec3 transformedNormal = normalMatrix * objectNormal;

        vNormal = normalize( transformedNormal );

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;

        vViewPosition = - mvPosition.xyz;

    }
    `,
// In the fragment shader
// "uniform mat4 viewMatrix;",
// "uniform vec3 cameraPosition;",
    fs: `
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
    vs2: `
    precision mediump int;
    precision mediump float;

    uniform vec3 lightPosition;

    // Varying
    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main(void) {

        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
        vNormalW = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vUV = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    }
    `,
    vs1: `
    precision highp float;

    // Varying
    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main(void) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
        vNormalW = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vUV = uv;
    }
    `,
    fs1: `
    precision highp float;

    // Varying
    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    
    // Refs
    uniform vec3 lightPosition;
    uniform sampler2D diffuseTexture;
    uniform sampler2D nightTexture;
    
    void main(void) {
        vec3 direction = lightPosition - vPositionW;
        vec3 lightVectorW = normalize(direction);
    
        // diffuse
        float lightDiffuse = max(0.05, dot(vNormalW, lightVectorW));
    
        vec3 color;
        vec4 nightColor = texture2D(nightTexture, vUV).rgba;
        vec3 diffuseColor = texture2D(diffuseTexture, vUV).rgb;
    
        color = diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
        gl_FragColor = vec4(color, 1.0);
    }
    `,
}