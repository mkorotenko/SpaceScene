import scene from './scene.js';
import colladaProcessing from'./libs/ColladaPostProcessing.js';
import animationLoader from './libs/AnimationLoader.js';

const models = [];

const model = function(mesh, animations) {
    this.mesh = mesh;
    this.animations = animations;
    this._inScene = false;
}
model.prototype.addToScene = function() {
    if (!this._inScene) {
        scene.add(this.mesh);

        this._inScene = true;
    }
}
model.prototype.removeFromScene = function() {
    if (this._inScene) {
        scene.remove(this.mesh);
        this._inScene = false;
    }
}

const colladaLoader = function(path) {
    return new Promise(function(resolve, reject) {
        (new THREE.ColladaLoader).load(path, function(collada) {
            var n = convertToMesh(collada.scene);
            var a = convertToAnimation(collada.animations);
            const m = new model(n, a);
            models.push(m);
            resolve(m)
        })
    })
}

const colladaGroup = function(path) {
    return new Promise(function(resolve, reject) {
        (new THREE.ColladaLoader).load(path, function(collada) {
            var group = convertToMesh(collada.scene);
            resolve(group)
        })
    })
}

var onError = function ( xhr ) { };
const objectLoader = function(path) {
    let fileNameIndex = path.lastIndexOf('/');
    let modelPath = path.substring(fileNameIndex+1,0);
    let fileName = path.substring(fileNameIndex+1);
    return new Promise(function(resolve, reject) {
        new THREE.MTLLoader()
        .setPath( modelPath )
        .load( fileName.replace('.obj', '.mtl'), function ( materials ) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( modelPath )
                .load( fileName, function ( object ) {
                    const m = new model(object, []);
                    models.push(m);
                    resolve(m)
                });
        } );
    })
}

const convertToMesh = function(e) {
    e.scale.x = e.scale.y = e.scale.z = 1;

    return colladaProcessing.collapseMaterialsPerName(e),
    colladaProcessing.convertMeshesWithThinlineMaterial(e),
    colladaProcessing.convertIncludedAdditiveMaterial(e),
    e
}

const convertToAnimation = function(n) {
    for (var a = [], s = 0; s < n.length; ++s) {
        var l = n[s]
          , c = new animationLoader(l.node,l);
        c.loop = !0,
        a.push(c)
    }
    if (a.length)
        console.info('animation', a);

    return a
}

const exports = {
    collada: colladaLoader,
    colladaGroup: colladaGroup,
    object: objectLoader,
    models: models
};

export default exports;