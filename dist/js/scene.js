var _mixers = [];
var _scene = function scene() {
        let _scene = new THREE.Scene();
        //_scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        // scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    return _scene;
}()

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
