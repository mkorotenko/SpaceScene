var shaders = require('./shaders.js');
var create = function() {
    return new Promise(function(resolve, reject) {
        const solar = new Promise( resolve => (new THREE.ObjectLoader()).load('models/solarSystem.json', object => resolve(object)));

        var textureLoader = new THREE.TextureLoader();
        // planet
        var materialNormal = new THREE.MeshPhongMaterial( {
            specular: 0x333333,
            shininess: 15,
            map: textureLoader.load( "textures/planets/EarthMap.jpg" ),
            specularMap: textureLoader.load( "textures/planets/earth_specularmap_flat_8192x4096.jpg" ),
            normalMap: textureLoader.load( "textures/planets/earth_normalmap_flat_8192x4096.jpg" ),
            normalScale: new THREE.Vector2( 0.85, 0.85 ),
            //bumpMap: textureLoader.load( "textures/planets/Earth_Bump_map.jpg" ),
            //bumpScale: 0.001,
            //emissiveMap: textureLoader.load( "textures/planets/earth-night-o2.png" ),
            transparent: true //to resolve artifacts cause by transparent Nebula
        });

        const sunPosition = {
            x: -0.00015217743389729112, 
            y: 0.0013767499288792747, 
            z: 0.0014427063671944287,
        };

        // const m4 = new THREE.Matrix4();
        // m4.set( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 );
        const pointLights = {
            color: new THREE.Color(1.4, 1.4, 1.4),
            decay:0,
            distance:0,
            position: new THREE.Vector3(sunPosition.x,sunPosition.y,sunPosition.z),
            shadow:false,
            shadowBias:0,
            shadowCameraFar:1000,
            shadowCameraNear:1,
            shadowMapSize: new THREE.Vector2(0, 0),
            shadowRadius:1
        };
        const uniforms = {
            ambientLightColor: { value: new THREE.Vector3( 0.02, 0.02, 0.02) },
            pointLights: { value: [pointLights] },

            lightPosition: { value: new THREE.Vector3(sunPosition.x,sunPosition.y,sunPosition.z) },
            shininess: { value: 15.0 },
            diffuse: { value: new THREE.Vector3( 1.0, 1.0, 1.0 ) },
            opacity: { value: 1.0 },
            map: { value: textureLoader.load( "textures/planets/EarthMap.jpg" ) },
            specular: { value: new THREE.Vector3( 0.2, 0.2, 0.2 ) },
            specularMap: { value: textureLoader.load( "textures/planets/earth_specularmap_flat_8192x4096.jpg" ) },
            normalMap: { value: textureLoader.load( "textures/planets/earth_normalmap_flat_8192x4096.jpg" ) },
            normalScale: { value: new THREE.Vector2( 0.85, 0.85 ) },
            emissive: { value: new THREE.Vector3( 0.55, 0.55, 0.55 ) },
            emissiveMap: { value: textureLoader.load( "textures/planets/earth-night-o2.png" ) }
        };
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shaders.vs,
            fragmentShader: shaders.fs,
            transparent: true,
            //lights: true
        });

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
