const sceneBuilder = require('./scene.js');
const colladaProcessing = require('./libs/ColladaPostProcessing.js').default;
var animationLoader = require('./libs/AnimationLoader.js').default;

const models = [];

const model = function(mesh) {
    this.mesh = mesh;
    this._inScene = false;
}
model.prototype.addToScene = function() {
    if (!this._inScene) {
        sceneBuilder.scene.add(this.mesh);
        this._inScene = true;
    }
}
model.prototype.removeFromScene = function() {
    if (this._inScene) {
        sceneBuilder.scene.remove(this.mesh);
        this._inScene = false;
    }
}

const loader = function(path) {
    return new Promise(function(resolve, reject) {
        (new THREE.ColladaLoader).load(path, function(collada) {
            var n = makeColladaObject(collada.scene, collada.animations);
            const m = new model(n);
            models.push(m);
            //sceneBuilder.scene.add(n);
            resolve(m)
        })
    })
}

const makeColladaObject = function(e, n) {
    e.scale.x = e.scale.y = e.scale.z = 1;
    for (var a = [], s = 0; s < n.length; ++s) {
        var l = n[s]
          , c = new animationLoader(l.node,l);
        c.loop = !0,
        a.push(c)
    }
    if (a.length)
        console.info('animation', a);

    return colladaProcessing.collapseMaterialsPerName(e),
    colladaProcessing.convertMeshesWithThinlineMaterial(e),
    colladaProcessing.convertIncludedAdditiveMaterial(e),
    e
}

module.exports = {
    new: loader,
    models: models
};
