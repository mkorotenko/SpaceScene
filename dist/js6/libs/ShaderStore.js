export default function(shaderNum) {
    switch(shaderNum){
        case 33:
            return `uniform vec2 resolution;
            varying vec3 texcoord;
            void main() {
                float d = 6.0 * (uv.y - 0.5);
                vec4 wpos = modelViewMatrix * vec4( position, 1.0 );
                vec4 wposN = modelViewMatrix * vec4( position + normal, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                vec4 vpn = projectionMatrix * wposN;
                float nx = vpn.x*vp.w - vpn.w*vp.x;
                float ny = vpn.y*vp.w - vpn.w*vp.y;
                vec3 t = normalize(vec3(nx, ny, 0));
                gl_Position = vp + vec4(d*vp.w*vec2(t.y/resolution.x, -t.x/resolution.y), 0, 0);
                texcoord = vec3(uv.x*vp.w, uv.y*vp.w, vp.w);
            }`
        case 34:
            return `uniform vec3 color;
            uniform float intensity;
            varying vec3 texcoord;
            void main() {
                float n = 2.0*(0.5 - abs(texcoord.y/texcoord.z-0.5));
                gl_FragColor = vec4(color.rgb, n * intensity);
            }`
        case 35:
            return `uniform vec2 resolution;
            varying vec3 texcoord;
            void main() {
                float d = 6.0 * (uv.y - 0.5);
                vec4 wpos = modelViewMatrix * vec4( position, 1.0 );
                vec4 wposN = modelViewMatrix * vec4( position + normal, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                vec4 vpn = projectionMatrix * wposN;
                float nx = vpn.x*vp.w - vpn.w*vp.x;
                float ny = vpn.y*vp.w - vpn.w*vp.y;
                vec3 t = normalize(vec3(nx, ny, 0));
                gl_Position = vp + vec4(d*vp.w*vec2(t.y/resolution.x, -t.x/resolution.y), 0, 0);
                texcoord = vec3(uv.x*vp.w, uv.y*vp.w, vp.w);
            }`
        case 36:
            return `uniform vec3 color;
            uniform float intensity;
            uniform float length;
            uniform float begin;
            uniform float end;
            
            varying vec3 texcoord;
            
            void main() {
                float n = 2.0*(0.5 - abs(texcoord.y/texcoord.z-0.5));
                
                float l = (texcoord.x/texcoord.z)*length;
                
                if (l < begin || l > length - end) {
                    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
                } else {
                    gl_FragColor = vec4(color.rgb, n * intensity);
                }
            }`
        case 37:
            return `uniform float width;
            uniform float devicePixelRatio;
            attribute float relThickness;
            uniform vec2 resolution;
            uniform float presence;
            uniform float highlight;
            uniform float length;
            varying vec3 texcoord;
            varying float vZ;
            varying float vcZ;
            varying float pitchFactor;
            
            void main() {
                float thickness = devicePixelRatio * width * 50.0;
                float d = 2.0 * thickness * (uv.y - 0.5);
            //	float d = 2.0 * uv.x * (uv.y - 0.5);
            //	float d = 6.0 * (uv.y - 0.5);
                vec4 wpos = modelViewMatrix * vec4( position, 1.0 );
                vZ = -wpos.z;
                vcZ = -(viewMatrix * vec4(0.,0.,0.,1.)).z;
                pitchFactor = 1.0 - abs((viewMatrix * vec4(0.,1.,0.,0.)).y);
                vec4 wposN = modelViewMatrix * vec4( position + normal, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                vec4 vpn = projectionMatrix * wposN;
                float nx = vpn.x*vp.w - vpn.w*vp.x;
                float ny = vpn.y*vp.w - vpn.w*vp.y;
                vec3 t = normalize(vec3(nx, ny, 0));
                gl_Position = vp + vec4(d*vp.w*vec2(t.y/resolution.x, -t.x/resolution.y), 0, 0);
                texcoord = vec3(uv.x, uv.y, relThickness);
            }`
        case 38:
            return `uniform float time;
            uniform sampler2D map;
            uniform float intensity;
            varying float vZ; 
            varying float vcZ;
            varying float pitchFactor;
            varying vec3 texcoord;
            uniform float length;
            uniform float twoways;
            uniform vec3 color;
            uniform vec3 colorBorder;
            uniform float width;
            uniform float size;
            uniform float density;
            uniform float speed;
            uniform float side;
            uniform float center;
            uniform float pitchEffect;
            uniform float pitchIntensity;
            uniform float presence;
            uniform float highlight;
            uniform float highlightFactor;
            uniform float depthFactor;
            
                            
            float rand(vec2 co){
                
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float noisemap(vec2 uv, float sizeFactor, float densityFactor, float speedFactor) {
                vec2 vf = vec2(uv.x + time * speedFactor * speed * (uv.y < 0.5 ? twoways : 1.0), uv.y)*(sizeFactor * 2. * size);	
                vec2 v = vec2(floor(vf.x), floor(vf.y));
                vec2 f = vf-v;	
                float r = 2.0*distance(f, vec2(0.5, 0.5));
                float d = 1.0 - min(r, 1.0);
                float p = rand(v);
                p = p < densityFactor * 3. * density ? d*(1.0 - 2.0 * abs(uv.y - 0.5)) : 0.0;
                return p;
            }
            
            void main() {
            
                float v = (texcoord.y-0.5)/texcoord.z+0.5;
                if(presence>1.) {
                    float k = max(0., texcoord.x - (presence-1.))/(2.0-presence);
                    v = (texcoord.y-0.5)/(k*texcoord.z)+0.5;
                }
                vec2 uv = vec2((texcoord.x-0.5)*length/30.0, v);
                float c = 1.0 - 2.0 * abs(uv.y - 0.5);
                vec3 tc = colorBorder;
                vec3 tcr = color;
                vec4 col = (uv.y >= 0.0 && uv.y <= 1.0)? 
                    c*vec4(tcr-vec3(0.,0.05,0.),  1.) * noisemap(uv, 6.0, 0.3, 2.0) +
                    c*vec4(tcr,  1.) * noisemap(uv, 10.0, 0.3, 3.0) +
                    c*vec4(tcr+vec3(0.,0.05,0.),  1.) * noisemap(uv, 16.0, 0.3, 4.0) +
                    vec4(c*c*tc*2.,1.0) +
                    center*vec4(c > 0.8 ? tcr*3.*(c-0.8) : vec3(0.), 1.0) +
                    side*vec4(c < 0.2 ? tc *1. * (1.-10.*abs(c-0.1)) : vec3(0.), 1.0) 
                    : vec4(0,0,0,0);
                //float fade = mix(1.0, pitchFactor*pitchFactor+0.05, clamp(vZ/(2.0+ (vcZ > 0.? vcZ : 0.)), 0., 1.));
                float fade = mix(1.0, 0.1, clamp(vZ*(1.+5.*depthFactor)/0.75, 0., 1.));
                fade = mix(fade, mix(fade, pitchIntensity*2.0, pitchFactor), pitchEffect);
                fade = mix(fade,1.,highlight);
                gl_FragColor = (1. + 4.* highlightFactor *highlight) * vec4(col.rgb*intensity*fade, col.a*intensity) * 
                    (presence <= 1. ? (texcoord.x < presence  ? 1. : 0.) : (texcoord.x > (presence-1.) ? 1. : 0.));
            }`;
        case 39:
            return `attribute vec3 color;
            uniform vec2 resolution;
            varying vec3 texcoord;
            varying vec3 vColor;
            void main() {
                float d = 6.0 * (uv.y - 0.5);
                vec4 wpos = modelViewMatrix * vec4( position, 1.0 );
                vec4 wposN = modelViewMatrix * vec4( position + normal, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                vec4 vpn = projectionMatrix * wposN;
                float nx = vpn.x*vp.w - vpn.w*vp.x;
                float ny = vpn.y*vp.w - vpn.w*vp.y;
                vec3 t = normalize(vec3(nx, ny, 0));
                gl_Position = vp + vec4(d*vp.w*vec2(t.y/resolution.x, -t.x/resolution.y), 0, 0);
                texcoord = vec3(uv.x*vp.w, uv.y*vp.w, vp.w);
                vColor = color;
            }`
        case 40:
            return `varying vec3 vColor;
            uniform float intensity;
            varying vec3 texcoord;
            void main() {
                float n = 3.0*(0.5 - abs(texcoord.y/texcoord.z-0.5));
                gl_FragColor = vec4(vColor.rgb, n * intensity);
            }`
        case 41:
            return `attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vec4 wpos = modelViewMatrix * vec4( position, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                gl_Position = vp;
                vColor = color;
            }`
        case 42:
            return `varying vec3 vColor;
            uniform float intensity;
            void main() {
                gl_FragColor = vec4(vColor.rgb, 1);
            }`
        case 43:
            return `uniform vec2 resolution;
            uniform vec3 color;
            uniform float intensity;
            //
            uniform vec2 radiusAndInvRadius;
            uniform float fadeBack;
            //
            ////varying vec2 texcoord;
            varying vec3 texcoord;
            varying vec4 vcolor;
            varying vec4 wpos;
            void main() {
                float d = 6.0 * (uv.y - 0.5);
                wpos = modelViewMatrix * vec4( position, 1.0 );
                vec4 wposN = modelViewMatrix * vec4( position + normal, 1.0 );
                vec4 vp = projectionMatrix * wpos;
                vec4 vpn = projectionMatrix * wposN;
                float nx = vpn.x*vp.w - vpn.w*vp.x;
                float ny = vpn.y*vp.w - vpn.w*vp.y;
                vec3 t = normalize(vec3(nx, ny, 0));
                gl_Position = vp + vec4(d*vp.w*vec2(t.y/resolution.x, -t.x/resolution.y), 0, 0);
            //+ 	//texcoord = uv;
                texcoord = vec3(uv.x*vp.w, uv.y*vp.w, vp.w);
            
            //	vec4 o = modelViewMatrix * vec4(0.0,0.0,0.0,1.0);
                vec3 o = modelViewMatrix[3].xyz;
            
                vec3 lo = vec3(dot(o, modelViewMatrix[0].xyz), dot(o, modelViewMatrix[1].xyz), dot(o, modelViewMatrix[2].xyz));
                float z = -dot(lo, position)/length(lo);
            
                float alpha;
            
                if (z < -radiusAndInvRadius.x) {
                    alpha = fadeBack;
                } else if (z < radiusAndInvRadius.x) {
                    alpha = fadeBack + (1.0 - fadeBack) * (radiusAndInvRadius.x + z) * 0.5 * radiusAndInvRadius.y;
                } else {
                    alpha = 1.0;
                }
                        
                vcolor = vec4(color,alpha*intensity);
            
            //	vcolor = color;
            
            }`
        case 44:
            return `//varying vec2 texcoord;
            varying vec4 vcolor;
            varying vec3 texcoord;
            varying vec4 wpos;
            uniform vec2 fade;
            uniform vec2 depth;
            float lerp(float a, float b, float t) { return (1.0-t)*a + t*b; }
            float clamp01(float a) { return a < 0.0? 0.0 : a < 1.0? a : 1.0; }
            void main() {
                float n = 2.0*(0.5 - abs(texcoord.y/texcoord.z-0.5));
            //	float d = clamp01(depth.y/abs(wpos.z));
            //	gl_FragColor = vec4(vcolor.rgb, 2.0 * n * d * vcolor.a);
                float d = lerp(fade.x, fade.y, clamp01((abs(wpos.z)-depth.x)/(depth.y-depth.x)));
                gl_FragColor = vec4(vcolor.rgb, 2.0 * n * d * d * vcolor.a);
            }`
    }
}
