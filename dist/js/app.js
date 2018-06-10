//https://stemkoski.github.io/Three.js/CSG.html
//https://stemkoski.github.io/Three.js/Mouse-Click.html
//https://github.com/soulwire/WebGL-GPU-Particles/blob/master/source/shaders/physics.fs
//https://robertsspaceindustries.com/starmap?camera=10,0,0.05,0,0
//http://skycraft.io/
//http://stuffin.space/
var sceneBuilder = require('./scene.js');
var modelLoader = require('./modelLoader.js');

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

    scene = sceneBuilder.scene;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0005, 1e7 );
    scene.add( camera );

    scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) );

    camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );

    var loader = new THREE.ObjectLoader();
    loader.load(
        // resource URL
        'models/model.json',
    
        // onLoad callback
        function ( object ) {
            //object.scale.multiplyScalar(1000);
            scene.add( object );
        },
    
        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
    
        // onError callback
        function( err ) {
            console.log( 'An error happened' );
        }
    );

    // var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    // hemiLight.color.setHSL( 0.6, 1, 0.6 );
    // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    // hemiLight.position.set( 0, 50, 0 );
    // scene.add( hemiLight );
    // var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    // scene.add( hemiLightHelper );

    // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    // directionalLight.position.set( 1, 1, 0 ).normalize();
    // scene.add( directionalLight );

    // //
    // var textureLoader = new THREE.TextureLoader();
    // // planet
    // var materialNormalMap = new THREE.MeshPhongMaterial( {
    //     specular: 0x333333,
    //     shininess: 15,
    //     map: textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
    //     specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
    //     normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
    //     normalScale: new THREE.Vector2( 0.85, 0.85 )
    // } );
    // geometry = new THREE.SphereBufferGeometry(radius, 100, 50);
    // meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
    // meshPlanet.position.x = 8000;
    // meshPlanet.rotation.y = 0;
    // meshPlanet.rotation.z = tilt;
    // scene.add(meshPlanet);
    // // clouds
    // var materialClouds = new THREE.MeshLambertMaterial({
    //     map: textureLoader.load("textures/planets/earth_clouds_1024.png"),
    //     transparent: true
    // });
    // meshClouds = new THREE.Mesh( geometry, materialClouds );
    // meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
    // meshClouds.rotation.z = tilt;
    // scene.add( meshClouds );
    // // moon
    // var materialMoon = new THREE.MeshPhongMaterial({
    //     map: textureLoader.load("textures/planets/moon_1024.jpg")
    // });
    // meshMoon = new THREE.Mesh(geometry, materialMoon);
    // meshMoon.position.set(radius * 5, 0, 0);
    // meshMoon.scale.set(moonScale, moonScale, moonScale);
    // scene.add(meshMoon);
    
    console.info('modelLoader', modelLoader);
    modelLoader.collada('./models/collada/models/Middle_Nebula.dae')
    //     .then(model=>{
    //         console.info('new model', model)
    //     });
    //modelLoader.collada('./models/collada/models/SpaceCube_Back.dae')
        .then(model => {
            function getMeshes(group) {
                var res = [];
                function req(group1) {
                    if (!group1 || !group1.children) return;
                    group1.children.forEach(o => {
                        if (o.material)
                            res.push(o.material)
                        else
                            req(o)
                    })
                }
                req(group);
                return res;
            }
            getMeshes(model.mesh).forEach(m => {
                m.depthTest = true;
            })
            model.mesh.scale.multiplyScalar(100000);
            model.addToScene();
        })
    // modelLoader.collada('./models/collada/models/PlanetRing.dae')
    //    .then(model => model.addToScene())
    // modelLoader.collada('./models/collada/models/Planet_Brown.dae')
    //    .then(model => model.addToScene())
    // modelLoader.object('./models/obj/VoyagerNCC74656/voyager.obj')
    //     .then(model => model.addToScene());

    camera.position.z = 1;
    camera.position.y = 1;
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    container.appendChild( stats.dom );

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 0.1;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    window.addEventListener( 'resize', onWindowResize, false );

    console.group();
    console.info('THREE', THREE);
    console.info('scene', scene);
    console.info('controls', controls);
    console.groupEnd();

    window.saveCameraState = saveCameraState;
    window.readCameraState = readCameraState;
    window.buildTree = buildTree;
}

function saveCameraState() {
    const position = JSON.stringify(camera.position);
    const rotation = JSON.stringify(camera.rotation);
    localStorage.setItem('camera', JSON.stringify({
        position: position,
        rotation: rotation
    }));
}

function readCameraState() {
    const set = localStorage.getItem('camera');
    if (set) {
        const settings = JSON.parse(set);
        const position = JSON.parse(settings.position);
        camera.position.set(position.x, position.y, position.z)
        const rotation = JSON.parse(settings.rotation);
        camera.rotation.set(rotation._x, rotation._y, rotation._z)
    }
        //Object.assign(camera, JSON.parse(cam));
}

function buildTree(group) {
    if (!group) return;
    if (group.children && group.children.length) {
        console.groupCollapsed(group.name, group.type, group)
        if (group.material)
            console.info('material', group.material);
        group.children.forEach(gr => buildTree(gr));
        console.groupEnd();
    }
    else {
        console.info('name', group.name, group);
        if (group.material)
            console.info('material', group.material);
    }
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

    sceneBuilder.mixers.forEach(mixer=>mixer.update( delta ));
    controls.update( delta );
    renderer.render( scene, camera );
}
