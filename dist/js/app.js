const scene = require('./scene.js').scene;
const camera = require('./camera.js').camera;
const nebula = require('./nebulaBox.js').create;
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

    nebula().then(model => scene.add(model))
    solarSystem().then(model => scene.add(raycaster.mesh = model));
    
    container.appendChild( scene.renderer.domElement );

    container.appendChild( stats.dom );

    controls = new InertialControl(camera);
    controls.movementSpeed = 0.1;
    controls.domElement = scene.renderer.domElement;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    window.addEventListener( 'keyup', () => camera.saveState(), false );
    window.addEventListener( 'mouseup', () => camera.saveState(), false );

    console.info('CONTROL', controls);

    window.scene = scene;
    window.camera = camera;
    window.get = get;

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

function get(name) {
    const res = [];
    if (!name)
        return res;

    const _name = name.toLocaleLowerCase();
    function searchFor(children, name) {
        children.forEach(c => {
            if (c.name && c.name.toLocaleLowerCase().includes(name))
                res.push(c);
            searchFor(c.children, name);
        })
    }
    searchFor(scene.children, _name)
    return res;
}

function animate() {
    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    controls.update( delta );
    scene.renderTo(camera);
    stats.update();
}

//exports = {}
//module = {}
// function jsLoader(jspath, callback) {
//     var headTag = document.getElementsByTagName("head")[0];
//     var jqTag = document.createElement('script');
//     jqTag.type = 'text/javascript';
//     jqTag.src = jspath;
//     jqTag.onload = callback;
//     headTag.appendChild(jqTag);
// }
//jsLoader('https://cdnjs.cloudflare.com/ajax/libs/three.js/93/three.js', function() {
//  console.info('js loaded', arguments)
//})
