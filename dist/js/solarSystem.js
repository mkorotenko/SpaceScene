var modelLoader = require('./modelLoader.js');

var create = function() {
    return new Promise(function(resolve, reject) {
        const nebula = modelLoader.colladaGroup('./models/collada/models/Middle_Nebula.dae')
        const solar = new Promise( resolve => (new THREE.ObjectLoader()).load('models/solarSystem.json', object => resolve(object)));

     var textureLoader = new THREE.TextureLoader();
    // // // planet
     var materialNormalMap = new THREE.MeshPhongMaterial( {
          specular: 0x333333,
          shininess: 15,
          map: textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
          specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
          normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
          normalScale: new THREE.Vector2( 0.85, 0.85 )
      } );
     var geometry = new THREE.IcosahedronBufferGeometry(0.2, 5);
     var earth = new THREE.Mesh(geometry, materialNormalMap);

     var c = 24*60*60*1000
     var l = ((Math.PI*2)/c)*30
     var g = (Math.PI/180)*23.5
     var earthGroup = new THREE.Group();
     earthGroup.add(earth);
     earthGroup.position.x = 1;
     earthGroup.rotation.z = g;

     var cnt = 0, m = Math.PI/(180*24*60*60*1000);
        setInterval(() => { 
        earth.rotation.y = l*cnt;
        cnt+=100;
    }, 30)

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
            models[0].name = 'Nebula group';
            models[0].scale.multiplyScalar(100000);

            const group = new THREE.Group();
            group.add(models[0]);
            group.add(models[1]);
            group.add(earthGroup);

            const light = new THREE.PointLight( 0xffffff, 1.8 );
            light.position.set(-0.00015217743389729112, 0.0013767499288792747, 0.0014427063671944287);
            light.name = 'Sun light';
            group.add( light );
        
            group.name = 'Solar system group';

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
