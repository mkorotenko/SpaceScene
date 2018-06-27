var shaders = require('./shaders.js');
var create = function() {
    return new Promise(function(resolve, reject) {
        const solar = new Promise( resolve => (new THREE.ObjectLoader()).load('models/solarSystem.json', object => resolve(object)));

        var textureLoader = new THREE.TextureLoader();
        // planet
        var materialNormal = new THREE.MeshPhongMaterial( {
            specular: 0x333333,
            shininess: 15,
            map: textureLoader.load( "textures/planets/8k_earth_daymap.jpg" ),
            specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
            normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
            normalScale: new THREE.Vector2( 0.85, 0.85 ),
            //emissiveMap: textureLoader.load( "textures/planets/earth-night-o2.png" ),
            transparent: true //to resolve artifacts cause by transparent Nebula
        });

        const sunPosition = {
            x: -0.00015217743389729112, 
            y: 0.0013767499288792747, 
            z: 0.0014427063671944287,
        };
        const uniforms = {
            lightPosition: {value: new THREE.Vector3(sunPosition.x,sunPosition.y,sunPosition.z) },
            diffuseTexture: { value: textureLoader.load( "textures/planets/8k_earth_daymap.jpg" ) },
            nightTexture: { value: textureLoader.load( "textures/planets/earth-night-o2.png" ) },
            normalTexture: { value: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ) }
          };
         const shaderMaterial = new THREE.ShaderMaterial({
             uniforms: uniforms,
             vertexShader: shaders.vs,
             fragmentShader: shaders.fs,
             transparent: true
           });
        // [.Offscreen-For-WebGL-0638A120]GL ERROR :GL_OUT_OF_MEMORY : glFramebufferTexture2D: <- error from previous GL command
        // 65[.Offscreen-For-WebGL-0638A120]GL ERROR :GL_OUT_OF_MEMORY : glFramebufferTexture2D: 
        // 7[.Offscreen-For-WebGL-0638A120]GL ERROR :GL_INVALID_FRAMEBUFFER_OPERATION : glClear: framebuffer incomplete (check)
        // 119[.Offscreen-For-WebGL-0638A120]GL ERROR :GL_INVALID_FRAMEBUFFER_OPERATION : glDrawArrays: framebuffer incomplete (check)
        // (index):1 WebGL: too many errors, no more errors will be reported to the console for this context.

        var geometry = new THREE.IcosahedronBufferGeometry(0.2, 5);
        var earth = new THREE.Mesh(geometry, shaderMaterial);

        var c = 24*60*60*1000
        var l = ((Math.PI*2)/c)*30
        var g = (Math.PI/180)*23.5
        var earthGroup = new THREE.Group();
        earthGroup.name = 'Earth group';
        earthGroup.add(earth);
        earthGroup.position.x = 1;
        earthGroup.rotation.z = g;

        var cnt = 0, m = Math.PI/(180*24*60*60*1000);
        setInterval(() => { 
            earth.rotation.y = l*cnt;
            cnt+=100;
        }, 30)

        Promise.all([solar]).then( models => {

            const group = new THREE.Group();
            group.add( new THREE.AmbientLight( 0xcccccc, 0.03 ) );
            const light = new THREE.PointLight( 0xffffff, 1.4 );
            light.position.set(sunPosition.x,sunPosition.y,sunPosition.z);
            light.name = 'Sun light';
            group.add( light );
        
            //group.add(models[0]);
            group.add(earthGroup);

            group.name = 'Solar system group';

            resolve(group);
        });
        
    })
    // modelLoader.object('./models/obj/VoyagerNCC74656/voyager.obj')
    //     .then(model => model.addToScene());
}

//a little bit different way of doing it than the player module
module.exports = {
    create: create,
};
