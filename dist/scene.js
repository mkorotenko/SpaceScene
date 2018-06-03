
var _scene;
function scene() {
    if (!_scene) {
        _scene = new THREE.Scene();
        //_scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        // scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    }

    return _scene;
}
//a little bit different way of doing it than the player module
module.exports = {
    scene: scene,
};
