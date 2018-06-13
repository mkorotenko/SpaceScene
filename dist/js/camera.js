
const camera = function camera() {
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0000001, 1e7 );
    camera.position.z = 1;
    camera.position.y = 1;
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    window.addEventListener( 'resize', onWindowResize, false );

    return camera;
}()

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

//a little bit different way of doing it than the player module
module.exports = {
    camera: camera,
};
