module.exports = {
    vs: `
    precision mediump int;
    precision mediump float;

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
    fs: `
    precision mediump int;
    precision mediump float;

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
        float lightDiffuse = clamp(dot(vNormalW, lightVectorW),0.02,1.0);
    
        vec3 color;
        vec4 nightColor = texture2D(nightTexture, vUV).rgba;
        vec3 diffuseColor = texture2D(diffuseTexture, vUV).rgb;
    
        color = diffuseColor * lightDiffuse + (nightColor.rgb * nightColor.a * pow((1.0 - lightDiffuse), 6.0));
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