
const camera = function camera() {
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0000001, 1e7 );
    camera.position.z = 1;
    camera.position.y = 1;
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    camera.saveState = saveState;
    camera.readState = readState;

    window.addEventListener( 'resize', onWindowResize, false );

    return camera;
}()

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function saveState(storageName = 'camera') {
    const position = JSON.stringify(camera.position);
    const rotation = JSON.stringify(camera.rotation);
    localStorage.setItem(storageName, `{"position":${ position },"rotation":${ rotation }}`);
}

function readState(storageName = 'camera') {
    const set = localStorage.getItem(storageName);
    if (set) {
        const settings = JSON.parse(set);
        var position, rotation;

        if (typeof settings.position === 'string')
            position = JSON.parse(settings.position);
        else
            position = settings.position;
        camera.position.set(position.x, position.y, position.z)

        if (typeof settings.rotation === 'string')
            rotation = JSON.parse(settings.rotation);
        else
            rotation = settings.rotation;
        camera.rotation.set(rotation._x, rotation._y, rotation._z)
    }
}

//a little bit different way of doing it than the player module
module.exports = {
    camera: camera,
};
