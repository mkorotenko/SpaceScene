// const scene = require('./scene.js').scene;
// const camera = require('./camera.js').camera;
// const nebula = require('./nebulaBox.js').create;
// const solarSystem = require('./solarSystem.js').create;
// const Raycaster = require('./raycaster.js').Raycaster;
// const InertialControl = require('./inertialControl.js').default;
import scene from './scene.js';
import camera from './camera.js';
import nebula from './nebulaBox.js';
import InertialControl from './inertialControl.js';

var stats = new Stats();
var clock = new THREE.Clock();

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

	console.info('scene', scene);

    // // const raycaster = new Raycaster(camera, undefined, 1);
    // // raycaster.onIntersects((intersects) => {
    // //     if (intersects.length > 0)
    // //         console.info('intersects', intersects);
    // // }) 
    // // document.addEventListener( 'click', 
    // // ( event ) => {
    // //     event.preventDefault();
    // //     raycaster.setVector(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    // //     if (raycaster.mesh)
    // //         raycaster.detectIntersects(true);
    // // }, false );

    nebula().then(model => {
         scene.add(model);
         get('nebula', '3d').forEach(n => n.visible = false);
    })
    // solarSystem().then(model => scene.add(raycaster.mesh = model));
    
    // new customScene(scene);

    container.appendChild( scene.renderer.domElement );

    container.appendChild( stats.dom );

    const controls = new InertialControl(camera);
    controls.movementSpeed = 0.1;
    controls.domElement = scene.renderer.domElement;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    window.addEventListener( 'keyup', () => camera.saveState(), false );
    window.addEventListener( 'mouseup', () => camera.saveState(), false );

    // console.info('CONTROL', controls);

    window.scene = scene;
    window.camera = camera;

    window.get = get;
    // window.solarSystem = require('./solarSystem.js');


    // const shaders = window.shaders = require('./shaders.js');
    // shaders.reset = function() {
    //     window.solarSystem.update();
    // }
    // shaders.restore = function() {
    //     window.solarSystem.update(localStorage.getItem('newVs'), localStorage.getItem('newFs'));
    // }
    // Object.defineProperty(
    //     shaders,
    //     'newVs',
    //     {
    //         set: function(value) {
    //             window.solarSystem.update(value);
    //             localStorage.setItem('newVs', value);
    //         }
    //     }
    // );
    // Object.defineProperty(
    //     shaders,
    //     'newFs',
    //     {
    //         set: function(value) {
    //             window.solarSystem.update(undefined, value);
    //             localStorage.setItem('newFs', value);
    //         }
    //     }
    // );

    camera.readState();
}

function animate() {
    requestAnimationFrame( animate );

    //const delta = clock.getDelta();

    //controls.update( delta );
    scene.renderTo(camera);
    stats.update();
}

function get(name, type) {
    const res = [];
    const _type = (type || '').toLocaleLowerCase();
    if (!name)
        return res;

    const _name = name.toLocaleLowerCase();
    function searchFor(children, name) {
        children.forEach(c => {
            if (c.name && c.name.toLocaleLowerCase().includes(name) && (!_type || (_type && c.type && c.type.toLocaleLowerCase().includes(_type))))
                res.push(c);
            searchFor(c.children, name);
        })
    }
    searchFor(scene.children, _name)
    return res;
}

export default () => {

	console.info('custom', stats, clock);
	init();
	animate();

};
