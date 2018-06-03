/**
 * @author Maxim / 
 */

var parseUniforms = function(json, textures) {
	if (!json)
		return;

	var uf = Object.keys(json);
	//var textures = this.textures;

	uf.forEach(key => {
		var ufv = json[key];
		switch(ufv.type) {
			case "v2":
				ufv.value = new THREE.Vector2(ufv.value.x, ufv.value.y);
				break; 
			case "v3":
				ufv.value = new THREE.Vector3(ufv.value.x, ufv.value.y, ufv.value.z);
				break; 
			case "c":
				ufv.value = new THREE.Color(ufv.value.r, ufv.value.g, ufv.value.b);
				break; 
			case "t":
				ufv.value = textures[ufv.value.uuid];
				break; 
		}
	})
}

var _parse = THREE.MaterialLoader.prototype.parse;
THREE.MaterialLoader.prototype.parse = function ( json ) {

	var res = _parse.apply(this, Array.prototype.slice.call(arguments));
	// var textures = this.textures;
	// if (res.uniforms && res.uniforms.map && res.uniforms.map.value.uuid)
	// res.uniforms.map.value = textures[res.uniforms.map.value.uuid];
	parseUniforms(res.uniforms, this.textures);
	return res;

}
