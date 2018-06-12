
const raycasterVector = function() {
    return new THREE.Vector2();
}()

function raycaster(camera, mesh) {
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.vector = new THREE.Vector2();
    this.mesh = mesh;
}

raycaster.prototype.intersects = function(recursive) {
    if (!this.mesh) return [];
    this.raycaster.setFromCamera( this.vector, this.camera );
    return this.raycaster.intersectObject( this.mesh, recursive );
}

//a little bit different way of doing it than the player module
module.exports = {
    raycaster: raycaster
};
