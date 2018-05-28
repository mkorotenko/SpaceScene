//https://stemkoski.github.io/Three.js/CSG.html
//https://stemkoski.github.io/Three.js/Mouse-Click.html
//https://github.com/soulwire/WebGL-GPU-Particles/blob/master/source/shaders/physics.fs
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var stats = new Stats();
var controls;
var clock = new THREE.Clock();
var radius = 6371;
var tilt = 0.41;
var cloudsScale = 1.005;
var moonScale = 0.23;
var rotationSpeed = 0.02;
var meshPlanet, meshClouds, meshMoon;

init();
animate();
function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.05, 1e7 );
    camera.position.z = 20;

    // scene
    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // model
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            //var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    new THREE.MTLLoader()
        .setPath( 'models/obj/VoyagerNCC74656/' )
        .load( 'voyager.mtl', function ( materials ) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/obj/VoyagerNCC74656/' )
                .load( 'voyager.obj', function ( object ) {
                    //object.position.y = - 95;
                    object.scale.multiplyScalar(10);
                    scene.add( object );
                });
        } );
    //
    var textureLoader = new THREE.TextureLoader();
    // planet
    var materialNormalMap = new THREE.MeshPhongMaterial( {
        specular: 0x333333,
        shininess: 15,
        map: textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
        specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
        normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
        normalScale: new THREE.Vector2( 0.85, 0.85 )
    } );
    geometry = new THREE.SphereBufferGeometry(radius, 100, 50);
    meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
    meshPlanet.position.x = 8000;
    meshPlanet.rotation.y = 0;
    meshPlanet.rotation.z = tilt;
    scene.add(meshPlanet);
    // clouds
    var materialClouds = new THREE.MeshLambertMaterial({
        map: textureLoader.load("textures/planets/earth_clouds_1024.png"),
        transparent: true
    });
    meshClouds = new THREE.Mesh( geometry, materialClouds );
    meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
    meshClouds.rotation.z = tilt;
    scene.add( meshClouds );
    // moon
    var materialMoon = new THREE.MeshPhongMaterial({
        map: textureLoader.load("textures/planets/moon_1024.jpg")
    });
    meshMoon = new THREE.Mesh(geometry, materialMoon);
    meshMoon.position.set(radius * 5, 0, 0);
    meshMoon.scale.set(moonScale, moonScale, moonScale);
    scene.add(meshMoon);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    container.appendChild( stats.dom );

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 1;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

function render() {
    var delta = clock.getDelta();
    meshPlanet.rotation.y += rotationSpeed * delta;
    meshClouds.rotation.y += 1.25 * rotationSpeed * delta;

    controls.update( delta );
    renderer.render( scene, camera );
}
