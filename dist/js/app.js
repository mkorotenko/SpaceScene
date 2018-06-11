//https://stemkoski.github.io/Three.js/CSG.html
//https://stemkoski.github.io/Three.js/Mouse-Click.html
//https://github.com/soulwire/WebGL-GPU-Particles/blob/master/source/shaders/physics.fs
//https://robertsspaceindustries.com/starmap?camera=10,0,0.05,0,0
//http://skycraft.io/
//http://stuffin.space/
//https://github.com/schteppe/gpu-physics.js
var sceneBuilder = require('./scene.js');
var solarSystem = require('./solarSystem.js');
var raycasterModule = require('./raycaster.js');

var camera, scene, renderer, controls;
// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;
var stats = new Stats();
var clock = new THREE.Clock();

init();
animate();
function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = sceneBuilder.scene;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0005, 1e7 );
    camera.position.z = 1;
    camera.position.y = 1;
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    scene.add( camera );

    scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) );

    const raycaster = new raycasterModule.Raycaster(camera, undefined, 1);
    raycaster.onIntersects((intersects) => {
        if (intersects.length > 0)
            console.info('intersects', intersects);
    }) 
    document.addEventListener( 'click', 
    ( event ) => {
        event.preventDefault();
        raycaster.vector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        raycaster.vector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.detectIntersects(true);
    }, false );

    solarSystem.create().then(model => scene.add(raycaster.mesh=model));
    
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
    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    console.group();
    console.info('THREE', THREE);
    console.info('scene', scene);
    console.info('controls', controls);
    console.groupEnd();

    window.saveCameraState = saveCameraState;
    window.readCameraState = readCameraState;
    window.buildTree = buildTree;
    window.scene = scene;

    readCameraState();
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
    // windowHalfX = window.innerWidth / 2;
    // windowHalfY = window.innerHeight / 2;
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
    const delta = clock.getDelta();

    sceneBuilder.mixers.forEach(mixer=>mixer.update( delta ));
    controls.update( delta );

    renderer.render( scene, camera );
}
