var _mixers = [];
function Scene() {
    //let _scene = new THREE.Scene();
    THREE.Scene.apply(this, Array.prototype.slice.call(arguments));
    //_scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    //_scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    const renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener( 'resize', onWindowResize.bind(this), false );

}

 Scene.prototype = Object.create(THREE.Scene.prototype);
 Scene.prototype.constructor = Scene;

 Scene.prototype.renderTo = function(camera) {
    this.renderer.render( this, camera );
}

function onWindowResize() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

const _scene = new Scene();

function createMixer(mesh) {
    var mixer = new THREE.AnimationMixer( mesh );
    _mixers.push(mixer);
    return mixer;
}
//a little bit different way of doing it than the player module
module.exports = {
    scene: _scene,
    createMixer: createMixer,
    mixers: _mixers,
};
