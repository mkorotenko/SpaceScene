//In the vertex shader
// "uniform mat4 modelMatrix;",
// "uniform mat4 modelViewMatrix;",
// "uniform mat4 projectionMatrix;",
// "uniform mat4 viewMatrix;",
// "uniform mat3 normalMatrix;",
// "uniform vec3 cameraPosition;",
//attribute vec3 position;
//attribute vec3 normal;
//attribute vec2 uv;
//http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
module.exports = {
    vs: `
    precision mediump int;
    precision mediump float;

    // Varying
    varying vec2 vUV;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    varying vec3 normalInterp;
    varying vec3 vertPos;

    void main(void) {

        vec4 position4 = vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
        vNormalW = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
        vUV = uv;
        
        vec4 vertPos4 = modelViewMatrix * position4;
        vertPos = vec3(vertPos4) / vertPos4.w;
        normalInterp = vNormalW;//normal * position;
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
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    varying vec3 normalInterp;
    varying vec3 vertPos;
    
    // Refs
    uniform vec3 lightPosition;
    uniform sampler2D diffuseTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D normalTexture;
    
    const vec3 specColor = vec3(1.0, 1.0, 1.0);

    void main(void) {
        vec3 lightVectorW = normalize(lightPosition - vPositionW);
    
        vec3 normal = 2.0 * texture2D (normalTexture, vUV).rgb - 1.0;
        normal = normalize (normal);

        // diffuse
        float lightDiffuse = clamp(dot(vNormalW, lightVectorW),0.015,1.0);
        float shininess = clamp(dot(normal, lightVectorW),0.01,1.0);
        float specular = 0.0;

        vec3 normal1 = normalize(normalInterp);
        vec3 viewDir = normalize(-vertPos);
        // this is blinn phong
        vec3 halfDir = normalize(lightVectorW + viewDir);
        float specAngle = max(dot(halfDir, normal1), 0.0);
        specular = pow(specAngle, 16.0);

        vec3 color;
        vec4 nightColor = texture2D(nightTexture, vUV).rgba;
        vec3 diffuseColor = texture2D(diffuseTexture, vUV).rgb;
    
        color = specular * specColor + (1.0-shininess) * diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
        gl_FragColor = vec4(color, 1.0);
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