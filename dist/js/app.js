//https://stemkoski.github.io/Three.js/CSG.html
//https://stemkoski.github.io/Three.js/Mouse-Click.html
//https://github.com/soulwire/WebGL-GPU-Particles/blob/master/source/shaders/physics.fs
//https://robertsspaceindustries.com/starmap?camera=10,0,0.05,0,0
//http://skycraft.io/
//http://stuffin.space/
//https://github.com/schteppe/gpu-physics.js
const scene = require('./scene.js').scene;
const camera = require('./camera.js').camera;
const solarSystem = require('./solarSystem.js').create;
const Raycaster = require('./raycaster.js').Raycaster;
const InertialControl = require('./inertialControl.js').default;

var controls;
var stats = new Stats();
var clock = new THREE.Clock();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) );

    const raycaster = new Raycaster(camera, undefined, 1);
    raycaster.onIntersects((intersects) => {
        if (intersects.length > 0)
            console.info('intersects', intersects);
    }) 
    document.addEventListener( 'click', 
    ( event ) => {
        event.preventDefault();
        raycaster.setVector(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
        if (raycaster.mesh)
            raycaster.detectIntersects(true);
    }, false );

    solarSystem().then(model => scene.add(raycaster.mesh = model));
    
    container.appendChild( scene.renderer.domElement );

    container.appendChild( stats.dom );

    controls = new InertialControl(camera);
    controls.movementSpeed = 0.1;
    controls.domElement = scene.renderer.domElement;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    console.info('CONTROL', controls);

    window.scene = scene;
    window.camera = camera;

    camera.readState();
}

// function buildTree(group) {
//     if (!group) return;
//     if (group.children && group.children.length) {
//         console.groupCollapsed(group.name, group.type, group)
//         if (group.material)
//             console.info('material', group.material);
//         group.children.forEach(gr => buildTree(gr));
//         console.groupEnd();
//     }
//     else {
//         console.info('name', group.name, group);
//         if (group.material)
//             console.info('material', group.material);
//     }
// }

function animate() {
    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    controls.update( delta );
    scene.renderTo(camera);
    stats.update();
}
