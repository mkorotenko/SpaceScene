var modelLoader = require('./modelLoader.js');

var create = function() {
    return new Promise(function(resolve, reject) {
        const nebula = modelLoader.colladaGroup('./models/collada/models/Middle_Nebula.dae')
        const solar = new Promise( resolve => (new THREE.ObjectLoader()).load('models/model.json', object => resolve(object)));

        Promise.all([nebula, solar]).then( models => {
            function getMeshes(group) {
                var res = [];
                function req(group1) {
                    if (!group1 || !group1.children) return;
                    group1.children.forEach(o => {
                        if (o.material)
                            res.push(o.material)
                        else
                            req(o)
                    })
                }
                req(group);
                return res;
            }
            getMeshes(models[0]).forEach(m => {
                m.depthTest = true;
            })
            models[0].scale.multiplyScalar(100000);

            const group = new THREE.Group();
            group.add(models[0]);
            group.add(models[1]);
            resolve(group);
        });
        
    })
    // modelLoader.object('./models/obj/VoyagerNCC74656/voyager.obj')
    //     .then(model => model.addToScene());
}

//a little bit different way of doing it than the player module
module.exports = {
    create: create,
};
