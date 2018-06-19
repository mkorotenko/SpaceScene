var modelLoader = require('./modelLoader.js');

var create = function() {
    return new Promise(function(resolve, reject) {
        const nebula = modelLoader.colladaGroup('./models/collada/models/Middle_Nebula.dae')

        Promise.all([nebula]).then( models => {
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
            models[0].name = 'Nebula group';
            models[0].scale.multiplyScalar(100000);

            resolve(models[0]);
        });
        
    })

}

//a little bit different way of doing it than the player module
module.exports = {
    create: create,
};
