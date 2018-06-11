
function Raycaster(camera, mesh, far) {
    this.raycaster = new THREE.Raycaster();
    if (far)
        this.raycaster.far = far;

    this.camera = camera;
    this.vector = new THREE.Vector2();
    this.mesh = mesh;
}

Raycaster.prototype.detectIntersects = function(recursive) {
    if (!this.mesh) return [];
    this.raycaster.setFromCamera( this.vector, this.camera );
    const intersects =  this.raycaster.intersectObject( this.mesh, recursive );
    if (this.onDetect && intersects.length)
        this.onDetect(intersects);
    return intersects;
}

Raycaster.prototype.onIntersects = function(handler) {
    this.onDetect = handler;
}

//a little bit different way of doing it than the player module
module.exports = {
    Raycaster: Raycaster
};
