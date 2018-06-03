//function(e) {
    var e = THREE;
    e.ColladaLoader = function() {
        function n(e, t, n, r) {
            var o = 0;
            if (document.implementation && document.implementation.createDocument) {
                var a = new XMLHttpRequest;
                a.onreadystatechange = function() {
                    if (4 === a.readyState) {
                        if (0 === a.status || 200 === a.status)
                            if (a.responseXML)
                                We = t,
                                i(a.responseXML, void 0, e);
                            else if (a.responseText) {
                                We = t;
                                var s = new DOMParser
                                  , l = s.parseFromString(a.responseText, "application/xml");
                                i(l, void 0, e)
                            } else
                                faillCallback ? r() : console.error("ColladaLoader: Empty or non-existing file (" + e + ")")
                    } else
                        3 === a.readyState && n && (0 === o && (o = a.getResponseHeader("Content-Length")),
                        n({
                            total: o,
                            loaded: a.responseText.length
                        }))
                }
                ,
                a.open("GET", e, !0),
                a.send(null)
            } else
                alert("Don't know how to parse XML!")
        }
        function i(t, n, i) {
            if (He = t,
            n = n || We,
            void 0 !== i) {
                var r = i.split("/");
                r.pop(),
                Ve = (r.length < 1 ? "." : r.join("/")) + "/"
            }
            a(),
            Ee(),
            Xe = l("library_images image", O, "image"),
            Qe = l("library_materials material", $, "material"),
            Ke = l("library_effects effect", re, "effect"),
            Ze = l("library_geometries geometry", H, "geometry"),
            $e = l("library_cameras camera", ue, "camera"),
            et = l("library_lights light", de, "light"),
            Je = l("library_controllers controller", R, "controller"),
            Ye = l("library_animations animation", ae, "animation"),
            Ne = l("library_visual_scenes visual_scene", D, "visual_scene"),
            je = l("library_kinematics_models kinematics_model", pe, "kinematics_model"),
            ze = [],
            Ue = [],
            Fe = c(),
            Ge = new e.Group;
            for (var o = 0; o < Fe.nodes.length; o++)
                Ge.add(S(Fe.nodes[o]));
            Ge.scale.multiplyScalar(it),
            h(),
            Be = u(),
            _();
            var s = {
                scene: Ge,
                morphs: ze,
                skins: Ue,
                animations: De,
                kinematics: Ie,
                dae: {
                    images: Xe,
                    materials: Qe,
                    cameras: $e,
                    lights: et,
                    effects: Ke,
                    geometries: Ze,
                    controllers: Je,
                    animations: Ye,
                    visualScenes: Ne,
                    visualScene: Fe,
                    scene: Fe,
                    kinematicsModels: je,
                    kinematicsModel: Be
                }
            };
            return n && n(s),
            s
        }
        function r(e) {
            tt = e
        }
        function a() {
            var e = He.querySelectorAll("asset")
              , t = e[0];
            if (t && t.childNodes)
                for (var n = 0; n < t.childNodes.length; n++) {
                    var i = t.childNodes[n];
                    switch (i.nodeName) {
                    case "unit":
                        var r = i.getAttribute("meter");
                        r && (it = parseFloat(r));
                        break;
                    case "up_axis":
                        rt = i.textContent.charAt(0)
                    }
                }
        }
        function l(e, t, n) {
            for (var i = He.querySelectorAll(e), r = {}, o = 0, a = i.length, s = 0; a > s; s++) {
                var l = i[s]
                  , c = (new t).parse(l);
                c.id && 0 !== c.id.length || (c.id = n + o++),
                r[c.id] = c
            }
            return r
        }
        function c() {
            var e = He.querySelectorAll("scene instance_visual_scene")[0];
            if (e) {
                var t = e.getAttribute("url").replace(/^#/, "");
                return Ne[t.length > 0 ? t : "visual_scene0"]
            }
            return null
        }
        function u() {
            var e = He.querySelectorAll("instance_kinematics_model")[0];
            if (e) {
                var t = e.getAttribute("url").replace(/^#/, "");
                return je[t.length > 0 ? t : "kinematics_model0"]
            }
            return null
        }
        function h() {
            De = [],
            d(Ge)
        }
        function d(e) {
            var t = Fe.getChildById(e.colladaId, !0)
              , n = null;
            if (t && t.keys) {
                n = {
                    fps: 60,
                    hierarchy: [{
                        node: t,
                        keys: t.keys,
                        sids: t.sids
                    }],
                    node: e,
                    name: "animation_" + e.name,
                    length: 0
                },
                De.push(n);
                for (var i = 0, r = t.keys.length; r > i; i++)
                    n.length = Math.max(n.length, t.keys[i].time)
            } else
                n = {
                    hierarchy: [{
                        keys: [],
                        sids: []
                    }]
                };
            for (var i = 0, r = e.children.length; r > i; i++)
                for (var o = d(e.children[i]), a = 0, s = o.hierarchy.length; s > a; a++)
                    n.hierarchy.push({
                        keys: [],
                        sids: []
                    });
            return n
        }
        function f() {
            var e, t = 1e6, n = -t, i = 0;
            for (var r in Ye) {
                var o = Ye[r];
                e = e || o.id;
                for (var a = 0; a < o.sampler.length; a++) {
                    var s = o.sampler[a];
                    s.create(),
                    t = Math.min(t, s.startTime),
                    n = Math.max(n, s.endTime),
                    i = Math.max(i, s.input.length)
                }
            }
            return {
                start: t,
                end: n,
                frames: i,
                ID: e
            }
        }
        function p(e, t) {
            var n = t instanceof V ? Je[t.url] : t;
            if (!n || !n.morph)
                return void console.log("could not find morph controller!");
            for (var i = n.morph, r = 0; r < i.targets.length; r++) {
                var o = i.targets[r]
                  , a = Ze[o];
                if (a.mesh && a.mesh.primitives && a.mesh.primitives.length) {
                    var s = a.mesh.primitives[0].geometry;
                    s.vertices.length === e.vertices.length && e.morphTargets.push({
                        name: "target_1",
                        vertices: s.vertices
                    })
                }
            }
            e.morphTargets.push({
                name: "target_Z",
                vertices: e.vertices
            })
        }
        function m(t, n, i, r) {
            if (t.world = t.world || new e.Matrix4,
            t.localworld = t.localworld || new e.Matrix4,
            t.world.copy(t.matrix),
            t.localworld.copy(t.matrix),
            t.channels && t.channels.length) {
                var o = t.channels[0]
                  , a = o.sampler.output[i];
                a instanceof e.Matrix4 && (t.world.copy(a),
                t.localworld.copy(a),
                0 === i && t.matrix.copy(a))
            }
            r && t.world.multiplyMatrices(r, t.world),
            n.push(t);
            for (var s = 0; s < t.nodes.length; s++)
                m(t.nodes[s], n, i, t.world)
        }
        function g(t, n) {
            for (var i = 0; i < t.length; i++) {
                var r = t[i]
                  , o = -1;
                if ("JOINT" == r.type) {
                    for (var a = 0; a < n.joints.length; a++)
                        if (r.sid === n.joints[a]) {
                            o = a;
                            break
                        }
                    if (o >= 0) {
                        var s = n.invBindMatrices[o];
                        r.invBindMatrix = s,
                        r.skinningMatrix = new e.Matrix4,
                        r.skinningMatrix.multiplyMatrices(r.world, s),
                        r.animatrix = new e.Matrix4,
                        r.animatrix.copy(r.localworld),
                        r.weights = [];
                        for (var a = 0; a < n.weights.length; a++)
                            for (var l = 0; l < n.weights[a].length; l++) {
                                var c = n.weights[a][l];
                                c.joint === o && r.weights.push(c)
                            }
                    } else
                        console.warn("ColladaLoader: Could not find joint '" + r.sid + "'."),
                        r.skinningMatrix = new e.Matrix4,
                        r.weights = []
                }
            }
        }
        function y(t) {
            var n = []
              , i = function(t, n, r) {
                var o = {};
                o.name = n.sid,
                o.parent = t,
                o.matrix = n.matrix;
                var a = [new e.Vector3, new e.Quaternion, new e.Vector3];
                o.matrix.decompose(a[0], a[1], a[2]),
                o.pos = [a[0].x, a[0].y, a[0].z],
                o.scl = [a[2].x, a[2].y, a[2].z],
                o.rotq = [a[1].x, a[1].y, a[1].z, a[1].w],
                r.push(o);
                for (var s in n.nodes)
                    i(n.sid, n.nodes[s], r)
            };
            return i(-1, t, n),
            n
        }
        function b(t, n, i) {
            var r = [];
            m(n, r, -1),
            g(r, i.skin),
            v = new e.Vector3;
            for (var a = [], l = 0; l < t.vertices.length; l++)
                a.push(new e.Vector3);
            for (l = 0; l < r.length; l++)
                if ("JOINT" == r[l].type)
                    for (j = 0; j < r[l].weights.length; j++)
                        w = r[l].weights[j],
                        vidx = w.index,
                        weight = w.weight,
                        o = t.vertices[vidx],
                        s = a[vidx],
                        v.x = o.x,
                        v.y = o.y,
                        v.z = o.z,
                        v.applyMatrix4(r[l].skinningMatrix),
                        s.x += v.x * weight,
                        s.y += v.y * weight,
                        s.z += v.z * weight;
            for (var l = 0; l < t.vertices.length; l++)
                t.vertices[l] = a[l]
        }
        function x(t, n, i) {
            var r = Je[n.url];
            if (i = void 0 !== i ? i : 40,
            !r || !r.skin)
                return void console.log("ColladaLoader: Could not find skin controller.");
            if (!n.skeleton || !n.skeleton.length)
                return void console.log("ColladaLoader: Could not find the skeleton for the skin. ");
            for (var o = f(), a = Fe.getChildById(n.skeleton[0], !0) || Fe.getChildBySid(n.skeleton[0], !0), s = y(a), l = r.skin.joints, c = [], u = 0; u < l.length; u++)
                for (var h = 0; h < s.length; h++)
                    s[h].name === l[u] && (c[u] = s[h]);
            for (var u = 0; u < c.length; u++)
                for (var h = 0; h < c.length; h++)
                    c[u].parent === c[h].name && (c[u].parent = h);
            var u, h, d;
            new e.Vector3;
            for (u = 0; u < t.vertices.length; u++)
                t.vertices[u].applyMatrix4(r.skin.bindShapeMatrix);
            for (var p = [], v = [], x = r.skin.weights, u = 0; u < x.length; u++) {
                var w = new e.Vector4(x[u][0] ? x[u][0].joint : 0,x[u][1] ? x[u][1].joint : 0,x[u][2] ? x[u][2].joint : 0,x[u][3] ? x[u][3].joint : 0)
                  , d = new e.Vector4(x[u][0] ? x[u][0].weight : 0,x[u][1] ? x[u][1].weight : 0,x[u][2] ? x[u][2].weight : 0,x[u][3] ? x[u][3].weight : 0);
                p.push(w),
                v.push(d)
            }
            t.skinIndices = p,
            t.skinWeights = v,
            t.bones = c;
            for (var _ = {
                name: o.ID,
                fps: 30,
                length: o.frames / 30,
                hierarchy: []
            }, h = 0; h < c.length; h++)
                _.hierarchy.push({
                    parent: c[h].parent,
                    name: c[h].name,
                    keys: []
                });
            for (console.log("ColladaLoader:", o.ID + " has " + c.length + " bones."),
            b(t, a, r),
            i = 0; i < o.frames; i++) {
                var S = [];
                m(a, S, i),
                g(S, r.skin);
                for (var u = 0; u < S.length; u++)
                    for (var h = 0; h < _.hierarchy.length; h++)
                        if (_.hierarchy[h].name === S[u].sid) {
                            var M = {};
                            M.time = i / 30,
                            M.matrix = S[u].animatrix,
                            0 === i && (S[u].matrix = M.matrix);
                            var C = [new e.Vector3, new e.Quaternion, new e.Vector3];
                            M.matrix.decompose(C[0], C[1], C[2]),
                            M.pos = [C[0].x, C[0].y, C[0].z],
                            M.scl = [C[2].x, C[2].y, C[2].z],
                            M.rot = C[1],
                            _.hierarchy[h].keys.push(M)
                        }
                t.animation = _
            }
        }
        function _() {
            if (Be && 0 === Be.joints.length)
                return void (Ie = void 0);
            var t = {}
              , n = function(e, n) {
                var i = n.getAttribute("id")
                  , r = Fe.getChildById(i, !0)
                  , o = Be.joints[e];
                Ge.traverse(function(n) {
                    n.colladaId == i && (t[e] = {
                        node: n,
                        transforms: r.transforms,
                        joint: o,
                        position: o.zeroPosition
                    })
                })
            };
            Ie = {
                joints: Be && Be.joints,
                getJointValue: function(e) {
                    var n = t[e];
                    return n ? n.position : void console.log("getJointValue: joint " + e + " doesn't exist")
                },
                setJointValue: function(n, i) {
                    var o = t[n];
                    if (o) {
                        var a = o.joint;
                        if (i > a.limits.max || i < a.limits.min)
                            console.log("setJointValue: joint " + n + " value " + i + " outside of limits (min: " + a.limits.min + ", max: " + a.limits.max + ")");
                        else if (a["static"])
                            console.log("setJointValue: joint " + n + " is static");
                        else {
                            var s = o.node
                              , l = a.axis
                              , c = o.transforms
                              , u = new e.Matrix4;
                            for (r = 0; r < c.length; r++) {
                                var h = c[r];
                                if (h.sid && -1 !== h.sid.indexOf("joint" + n))
                                    switch (a.type) {
                                    case "revolute":
                                        u.multiply(d.makeRotationAxis(l, e.Math.degToRad(i)));
                                        break;
                                    case "prismatic":
                                        u.multiply(d.makeTranslation(l.x * i, l.y * i, l.z * i));
                                        break;
                                    default:
                                        console.warn("setJointValue: unknown joint type: " + a.type)
                                    }
                                else {
                                    var d = new e.Matrix4;
                                    switch (h.type) {
                                    case "matrix":
                                        u.multiply(h.obj);
                                        break;
                                    case "translate":
                                        u.multiply(d.makeTranslation(h.obj.x, h.obj.y, h.obj.z));
                                        break;
                                    case "rotate":
                                        u.multiply(d.makeRotationAxis(h.obj, h.angle))
                                    }
                                }
                            }
                            var f = u.elements
                              , p = Array.prototype.slice.call(f)
                              , m = [p[0], p[4], p[8], p[12], p[1], p[5], p[9], p[13], p[2], p[6], p[10], p[14], p[3], p[7], p[11], p[15]];
                            s.matrix.set.apply(s.matrix, m),
                            s.matrix.decompose(s.position, s.quaternion, s.scale)
                        }
                    } else
                        console.log("setJointValue: joint " + n + " doesn't exist")
                }
            };
            var i = He.querySelector("scene instance_kinematics_scene");
            if (i)
                for (var r = 0; r < i.childNodes.length; r++) {
                    var o = i.childNodes[r];
                    if (1 == o.nodeType)
                        switch (o.nodeName) {
                        case "bind_joint_axis":
                            var a = o.getAttribute("target").split("/").pop()
                              , s = o.querySelector("axis param").textContent
                              , l = parseInt(s.split("joint").pop().split(".")[0])
                              , c = He.querySelector('[sid="' + a + '"]');
                            if (c) {
                                var u = c.parentElement;
                                n(l, u)
                            }
                        }
                }
        }
        function S(t, n) {
            var i, r, o, a, s = new e.Object3D, l = !1;
            for (o = 0; o < t.controllers.length; o++) {
                var c = Je[t.controllers[o].url];
                switch (c.type) {
                case "skin":
                    if (Ze[c.skin.source]) {
                        var u = new U;
                        u.url = c.skin.source,
                        u.instance_material = t.controllers[o].instance_material,
                        t.geometries.push(u),
                        l = !0,
                        i = t.controllers[o]
                    } else if (Je[c.skin.source]) {
                        var h = Je[c.skin.source];
                        if (r = h,
                        h.morph && Ze[h.morph.source]) {
                            var u = new U;
                            u.url = h.morph.source,
                            u.instance_material = t.controllers[o].instance_material,
                            t.geometries.push(u)
                        }
                    }
                    break;
                case "morph":
                    if (Ze[c.morph.source]) {
                        var u = new U;
                        u.url = c.morph.source,
                        u.instance_material = t.controllers[o].instance_material,
                        t.geometries.push(u),
                        r = t.controllers[o]
                    }
                    console.log("ColladaLoader: Morph-controller partially supported.")
                }
            }
            var d = {};
            for (o = 0; o < t.geometries.length; o++) {
                var f, m = t.geometries[o], v = m.instance_material, g = Ze[m.url], y = {}, b = [], w = 0;
                if (g) {
                    if (!g.mesh || !g.mesh.primitives)
                        continue;
                    if (0 === s.name.length && (s.name = g.id),
                    v)
                        for (a = 0; a < v.length; a++) {
                            var _ = v[a]
                              , M = Qe[_.target]
                              , C = M.instance_effect.url
                              , T = Ke[C].shader
                              , E = T.material;
                            if (g.doubleSided) {
                                if (!(_.symbol in d)) {
                                    var k = E.clone();
                                    k.side = e.DoubleSide,
                                    d[_.symbol] = k
                                }
                                E = d[_.symbol]
                            }
                            E.opacity = E.opacity ? E.opacity : 1,
                            y[_.symbol] = w,
                            b.push(E),
                            f = E,
                            f.name = null === M.name || "" === M.name ? M.id : M.name,
                            w++
                        }
                    var A, P = f || new e.MeshLambertMaterial({
                        color: 14540253,
                        side: g.doubleSided ? e.DoubleSide : e.FrontSide
                    }), L = g.mesh.geometry3js;
                    if (w > 1)
                        for (P = new e.MeshFaceMaterial(b),
                        a = 0; a < L.faces.length; a++) {
                            var O = L.faces[a];
                            O.materialIndex = y[O.daeMaterial]
                        }
                    void 0 !== i ? (x(L, i),
                    L.morphTargets.length > 0 ? (P.morphTargets = !0,
                    P.skinning = !1) : (P.morphTargets = !1,
                    P.skinning = !0),
                    A = new e.SkinnedMesh(L,P,!1),
                    A.name = "skin_" + Ue.length,
                    Ue.push(A)) : void 0 !== r ? (p(L, r),
                    P.morphTargets = !0,
                    A = new e.Mesh(L,P),
                    A.name = "morph_" + ze.length,
                    ze.push(A)) : A = L.isLineStrip === !0 ? new e.Line(L) : new e.Mesh(L,P),
                    s.add(A)
                }
            }
            for (o = 0; o < t.cameras.length; o++) {
                var R = t.cameras[o]
                  , F = $e[R.url]
                  , B = new e.PerspectiveCamera(F.yfov,parseFloat(F.aspect_ratio),parseFloat(F.znear),parseFloat(F.zfar));
                s.add(B)
            }
            for (o = 0; o < t.lights.length; o++) {
                var D = null
                  , I = t.lights[o]
                  , N = et[I.url];
                if (N && N.technique) {
                    var j, V = N.color.getHex(), z = N.intensity, H = N.distance, G = N.falloff_angle;
                    switch (N.technique) {
                    case "directional":
                        D = new e.DirectionalLight(V,z,H),
                        D.position.set(0, 0, 1);
                        break;
                    case "point":
                        D = new e.PointLight(V,z,H);
                        break;
                    case "spot":
                        D = new e.SpotLight(V,z,H,G,j),
                        D.position.set(0, 0, 1);
                        break;
                    case "ambient":
                        D = new e.AmbientLight(V)
                    }
                }
                D && s.add(D)
            }
            if (s.name = t.name || t.id || "",
            s.colladaId = t.id || "",
            s.layer = t.layer || "",
            s.matrix = t.matrix,
            s.matrix.decompose(s.position, s.quaternion, s.scale),
            nt.centerGeometry && s.geometry) {
                var W = s.geometry.center();
                W.multiply(s.scale),
                W.applyQuaternion(s.quaternion),
                s.position.sub(W)
            }
            for (o = 0; o < t.nodes.length; o++)
                s.add(S(t.nodes[o], t));
            return s
        }
        function M(e) {
            for (var t = He.querySelectorAll("library_nodes node"), n = 0; n < t.length; n++) {
                var i = t[n].attributes.getNamedItem("id");
                if (i && i.value === e)
                    return t[n]
            }
            return void 0
        }
        function C(e) {
            var t = []
              , n = 1e6
              , i = -1e6;
            for (var r in Ye)
                for (var o = Ye[r], a = 0; a < o.channel.length; a++) {
                    var s = o.channel[a]
                      , l = o.sampler[a]
                      , r = s.target.split("/")[0];
                    r == e.id && (l.create(),
                    s.sampler = l,
                    n = Math.min(n, l.startTime),
                    i = Math.max(i, l.endTime),
                    t.push(s))
                }
            return t.length && (e.startTime = n,
            e.endTime = i),
            t
        }
        function T(e) {
            if (e.channels && e.channels.length) {
                for (var t = [], n = [], i = 0, r = e.channels.length; r > i; i++) {
                    var o, a = e.channels[i], s = a.fullSid, l = a.sampler, c = l.input, u = e.getTransformBySid(a.sid);
                    if (a.arrIndices) {
                        o = [];
                        for (var h = 0, d = a.arrIndices.length; d > h; h++)
                            o[h] = Oe(a.arrIndices[h])
                    } else
                        o = Re(a.member);
                    if (u) {
                        -1 === n.indexOf(s) && n.push(s);
                        for (var h = 0, d = c.length; d > h; h++) {
                            var f = c[h]
                              , p = l.getData(u.type, h, o)
                              , m = E(t, f);
                            if (!m) {
                                m = new ce(f);
                                var v = k(t, f);
                                t.splice(-1 === v ? t.length : v, 0, m)
                            }
                            m.addTarget(s, u, o, p)
                        }
                    } else
                        console.log('Could not find transform "' + a.sid + '" in node ' + e.id)
                }
                for (var i = 0; i < n.length; i++)
                    for (var g = n[i], h = 0; h < t.length; h++) {
                        var m = t[h];
                        m.hasTarget(g) || A(t, m, h, g)
                    }
                e.keys = t,
                e.sids = n
            }
        }
        function E(e, t) {
            for (var n = null, i = 0, r = e.length; r > i && null === n; i++) {
                var o = e[i];
                if (o.time === t)
                    n = o;
                else if (o.time > t)
                    break
            }
            return n
        }
        function k(e, t) {
            for (var n = -1, i = 0, r = e.length; r > i && -1 === n; i++) {
                var o = e[i];
                o.time >= t && (n = i)
            }
            return n
        }
        function A(e, t, n, i) {
            var r = L(e, i, n ? n - 1 : 0)
              , o = P(e, i, n + 1);
            if (r && o) {
                var a, s = (t.time - r.time) / (o.time - r.time), l = r.getTarget(i), c = o.getTarget(i).data, u = l.data;
                if ("matrix" === l.type)
                    a = u;
                else if (u.length) {
                    a = [];
                    for (var h = 0; h < u.length; ++h)
                        a[h] = u[h] + (c[h] - u[h]) * s
                } else
                    a = u + (c - u) * s;
                t.addTarget(i, l.transform, l.member, a)
            }
        }
        function P(e, t, n) {
            for (; n < e.length; n++) {
                var i = e[n];
                if (i.hasTarget(t))
                    return i
            }
            return null
        }
        function L(e, t, n) {
            for (n = n >= 0 ? n : n + e.length; n >= 0; n--) {
                var i = e[n];
                if (i.hasTarget(t))
                    return i
            }
            return null
        }
        function O() {
            this.id = "",
            this.init_from = ""
        }
        function R() {
            this.id = "",
            this.name = "",
            this.type = "",
            this.skin = null,
            this.morph = null
        }
        function F() {
            this.method = null,
            this.source = null,
            this.targets = null,
            this.weights = null
        }
        function B() {
            this.source = "",
            this.bindShapeMatrix = null,
            this.invBindMatrices = [],
            this.joints = [],
            this.weights = []
        }
        function D() {
            this.id = "",
            this.name = "",
            this.nodes = [],
            this.scene = new e.Group
        }
        function I() {
            this.id = "",
            this.name = "",
            this.sid = "",
            this.nodes = [],
            this.controllers = [],
            this.transforms = [],
            this.geometries = [],
            this.channels = [],
            this.matrix = new e.Matrix4
        }
        function N() {
            this.sid = "",
            this.type = "",
            this.data = [],
            this.obj = null
        }
        function V() {
            this.url = "",
            this.skeleton = [],
            this.instance_material = []
        }
        function z() {
            this.symbol = "",
            this.target = ""
        }
        function U() {
            this.url = "",
            this.instance_material = []
        }
        function H() {
            this.id = "",
            this.mesh = null
        }
        function G(e) {
            this.geometry = e.id,
            this.primitives = [],
            this.vertices = null,
            this.geometry3js = null
        }
        function W() {
            this.material = "",
            this.count = 0,
            this.inputs = [],
            this.vcount = null,
            this.p = [],
            this.geometry = new e.Geometry
        }
        function q() {
            W.call(this),
            this.vcount = []
        }
        function X() {
            W.call(this),
            this.vcount = 1
        }
        function Y() {
            W.call(this),
            this.vcount = 3
        }
        function J() {
            this.source = "",
            this.count = 0,
            this.stride = 0,
            this.params = []
        }
        function Z() {
            this.input = {}
        }
        function Q() {
            this.semantic = "",
            this.offset = 0,
            this.source = "",
            this.set = 0
        }
        function K(e) {
            this.id = e,
            this.type = null
        }
        function $() {
            this.id = "",
            this.name = "",
            this.instance_effect = null
        }
        function ee() {
            this.color = new e.Color,
            this.color.setRGB(Math.random(), Math.random(), Math.random()),
            this.color.a = 1,
            this.texture = null,
            this.texcoord = null,
            this.texOpts = null
        }
        function te(e, t) {
            this.type = e,
            this.effect = t,
            this.material = null
        }
        function ne(e) {
            this.effect = e,
            this.init_from = null,
            this.format = null
        }
        function ie(e) {
            this.effect = e,
            this.source = null,
            this.wrap_s = null,
            this.wrap_t = null,
            this.minfilter = null,
            this.magfilter = null,
            this.mipfilter = null
        }
        function re() {
            this.id = "",
            this.name = "",
            this.shader = null,
            this.surface = {},
            this.sampler = {}
        }
        function oe() {
            this.url = ""
        }
        function ae() {
            this.id = "",
            this.name = "",
            this.source = {},
            this.sampler = [],
            this.channel = []
        }
        function se(e) {
            this.animation = e,
            this.source = "",
            this.target = "",
            this.fullSid = null,
            this.sid = null,
            this.dotSyntax = null,
            this.arrSyntax = null,
            this.arrIndices = null,
            this.member = null
        }
        function le(e) {
            this.id = "",
            this.animation = e,
            this.inputs = [],
            this.input = null,
            this.output = null,
            this.strideOut = null,
            this.interpolation = null,
            this.startTime = null,
            this.endTime = null,
            this.duration = 0
        }
        function ce(e) {
            this.targets = [],
            this.time = e
        }
        function ue() {
            this.id = "",
            this.name = "",
            this.technique = ""
        }
        function he() {
            this.url = ""
        }
        function de() {
            this.id = "",
            this.name = "",
            this.technique = ""
        }
        function fe() {
            this.url = ""
        }
        function pe() {
            this.id = "",
            this.name = "",
            this.joints = [],
            this.links = []
        }
        function me() {
            this.sid = "",
            this.name = "",
            this.axis = new e.Vector3,
            this.limits = {
                min: 0,
                max: 0
            },
            this.type = "",
            this["static"] = !1,
            this.zeroPosition = 0,
            this.middlePosition = 0
        }
        function ve() {
            this.sid = "",
            this.name = "",
            this.transforms = [],
            this.attachments = []
        }
        function ge() {
            this.joint = "",
            this.transforms = [],
            this.links = []
        }
        function ye(e) {
            var t = e.getAttribute("id");
            return void 0 != qe[t] ? qe[t] : (qe[t] = new K(t).parse(e),
            qe[t])
        }
        function be(e) {
            for (var t = _e(e), n = [], i = 0, r = t.length; r > i; i++)
                n.push("true" === t[i] || "1" === t[i] ? !0 : !1);
            return n
        }
        function xe(e) {
            for (var t = _e(e), n = [], i = 0, r = t.length; r > i; i++)
                n.push(parseFloat(t[i]));
            return n
        }
        function we(e) {
            for (var t = _e(e), n = [], i = 0, r = t.length; r > i; i++)
                n.push(parseInt(t[i], 10));
            return n
        }
        function _e(e) {
            return e.length > 0 ? Se(e).split(/\s+/) : []
        }
        function Se(e) {
            return e.replace(/^\s+/, "").replace(/\s+$/, "")
        }
        function Me(e, t, n) {
            return e.hasAttribute(t) ? parseInt(e.getAttribute(t), 10) : n
        }
        function Ce(t, n) {
            loader = new e.ImageLoader,
            loader.load(n, function(e) {
                t.image = e,
                t.needsUpdate = !0
            })
        }
        function Te(e, t) {
            e.doubleSided = !1;
            var n = t.querySelectorAll("extra double_sided")[0];
            n && n && 1 === parseInt(n.textContent, 10) && (e.doubleSided = !0)
        }
        function Ee() {
            if (nt.convertUpAxis !== !0 || rt === nt.upAxis)
                ot = null;
            else
                switch (rt) {
                case "X":
                    ot = "Y" === nt.upAxis ? "XtoY" : "XtoZ";
                    break;
                case "Y":
                    ot = "X" === nt.upAxis ? "YtoX" : "YtoZ";
                    break;
                case "Z":
                    ot = "X" === nt.upAxis ? "ZtoX" : "ZtoY"
                }
        }
        function ke(e, t) {
            if (nt.convertUpAxis === !0 && rt !== nt.upAxis)
                switch (ot) {
                case "XtoY":
                    var n = e[0];
                    e[0] = t * e[1],
                    e[1] = n;
                    break;
                case "XtoZ":
                    var n = e[2];
                    e[2] = e[1],
                    e[1] = e[0],
                    e[0] = n;
                    break;
                case "YtoX":
                    var n = e[0];
                    e[0] = e[1],
                    e[1] = t * n;
                    break;
                case "YtoZ":
                    var n = e[1];
                    e[1] = t * e[2],
                    e[2] = n;
                    break;
                case "ZtoX":
                    var n = e[0];
                    e[0] = e[1],
                    e[1] = e[2],
                    e[2] = n;
                    break;
                case "ZtoY":
                    var n = e[1];
                    e[1] = e[2],
                    e[2] = t * n
                }
        }
        function Ae(e, t) {
            if (nt.convertUpAxis !== !0 || rt === nt.upAxis)
                return t;
            switch (e) {
            case "X":
                t = "XtoY" === ot ? -1 * t : t;
                break;
            case "Y":
                t = "YtoZ" === ot || "YtoX" === ot ? -1 * t : t;
                break;
            case "Z":
                t = "ZtoY" === ot ? -1 * t : t
            }
            return t
        }
        function Pe(t, n) {
            var i = [t[n], t[n + 1], t[n + 2]];
            return ke(i, -1),
            new e.Vector3(i[0],i[1],i[2])
        }
        function Le(t) {
            if (nt.convertUpAxis) {
                var n = [t[0], t[4], t[8]];
                ke(n, -1),
                t[0] = n[0],
                t[4] = n[1],
                t[8] = n[2],
                n = [t[1], t[5], t[9]],
                ke(n, -1),
                t[1] = n[0],
                t[5] = n[1],
                t[9] = n[2],
                n = [t[2], t[6], t[10]],
                ke(n, -1),
                t[2] = n[0],
                t[6] = n[1],
                t[10] = n[2],
                n = [t[0], t[1], t[2]],
                ke(n, -1),
                t[0] = n[0],
                t[1] = n[1],
                t[2] = n[2],
                n = [t[4], t[5], t[6]],
                ke(n, -1),
                t[4] = n[0],
                t[5] = n[1],
                t[6] = n[2],
                n = [t[8], t[9], t[10]],
                ke(n, -1),
                t[8] = n[0],
                t[9] = n[1],
                t[10] = n[2],
                n = [t[3], t[7], t[11]],
                ke(n, -1),
                t[3] = n[0],
                t[7] = n[1],
                t[11] = n[2]
            }
            return (new e.Matrix4).set(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15])
        }
        function Oe(e) {
            if (e > -1 && 3 > e) {
                var t = ["X", "Y", "Z"]
                  , n = {
                    X: 0,
                    Y: 1,
                    Z: 2
                };
                e = Re(t[e]),
                e = n[e]
            }
            return e
        }
        function Re(e) {
            if (nt.convertUpAxis)
                switch (e) {
                case "X":
                    switch (ot) {
                    case "XtoY":
                    case "XtoZ":
                    case "YtoX":
                        e = "Y";
                        break;
                    case "ZtoX":
                        e = "Z"
                    }
                    break;
                case "Y":
                    switch (ot) {
                    case "XtoY":
                    case "YtoX":
                    case "ZtoX":
                        e = "X";
                        break;
                    case "XtoZ":
                    case "YtoZ":
                    case "ZtoY":
                        e = "Z"
                    }
                    break;
                case "Z":
                    switch (ot) {
                    case "XtoZ":
                        e = "X";
                        break;
                    case "YtoZ":
                    case "ZtoX":
                    case "ZtoY":
                        e = "Y"
                    }
                }
            return e
        }
        var Fe, Be, De, Ie, Ne, je, Ve, ze, Ue, He = null, Ge = null, We = null, qe = {}, Xe = {}, Ye = {}, Je = {}, Ze = {}, Qe = {}, Ke = {}, $e = {}, et = {}, tt = e.SmoothShading, nt = {
            centerGeometry: !1,
            convertUpAxis: !1,
            subdivideFaces: !0,
            upAxis: "Y",
            defaultEnvMap: null
        }, it = 1, rt = "Y", ot = null;
        return O.prototype.parse = function(e) {
            this.id = e.getAttribute("id");
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                "init_from" === n.nodeName && (this.init_from = n.textContent)
            }
            return this
        }
        ,
        R.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name"),
            this.type = "none";
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "skin":
                    this.skin = (new B).parse(n),
                    this.type = n.nodeName;
                    break;
                case "morph":
                    this.morph = (new F).parse(n),
                    this.type = n.nodeName
                }
            }
            return this
        }
        ,
        F.prototype.parse = function(e) {
            var t, n = {}, i = [];
            for (this.method = e.getAttribute("method"),
            this.source = e.getAttribute("source").replace(/^#/, ""),
            t = 0; t < e.childNodes.length; t++) {
                var r = e.childNodes[t];
                if (1 == r.nodeType)
                    switch (r.nodeName) {
                    case "source":
                        var o = (new K).parse(r);
                        n[o.id] = o;
                        break;
                    case "targets":
                        i = this.parseInputs(r);
                        break;
                    default:
                        console.log(r.nodeName)
                    }
            }
            for (t = 0; t < i.length; t++) {
                var a = i[t]
                  , o = n[a.source];
                switch (a.semantic) {
                case "MORPH_TARGET":
                    this.targets = o.read();
                    break;
                case "MORPH_WEIGHT":
                    this.weights = o.read()
                }
            }
            return this
        }
        ,
        F.prototype.parseInputs = function(e) {
            for (var t = [], n = 0; n < e.childNodes.length; n++) {
                var i = e.childNodes[n];
                if (1 == i.nodeType)
                    switch (i.nodeName) {
                    case "input":
                        t.push((new Q).parse(i))
                    }
            }
            return t
        }
        ,
        B.prototype.parse = function(e) {
            var t, n, i = {};
            this.source = e.getAttribute("source").replace(/^#/, ""),
            this.invBindMatrices = [],
            this.joints = [],
            this.weights = [];
            for (var r = 0; r < e.childNodes.length; r++) {
                var o = e.childNodes[r];
                if (1 == o.nodeType)
                    switch (o.nodeName) {
                    case "bind_shape_matrix":
                        var a = xe(o.textContent);
                        this.bindShapeMatrix = Le(a);
                        break;
                    case "source":
                        var s = (new K).parse(o);
                        i[s.id] = s;
                        break;
                    case "joints":
                        t = o;
                        break;
                    case "vertex_weights":
                        n = o;
                        break;
                    default:
                        console.log(o.nodeName)
                    }
            }
            return this.parseJoints(t, i),
            this.parseWeights(n, i),
            this
        }
        ,
        B.prototype.parseJoints = function(e, t) {
            for (var n = 0; n < e.childNodes.length; n++) {
                var i = e.childNodes[n];
                if (1 == i.nodeType)
                    switch (i.nodeName) {
                    case "input":
                        var r = (new Q).parse(i)
                          , o = t[r.source];
                        "JOINT" === r.semantic ? this.joints = o.read() : "INV_BIND_MATRIX" === r.semantic && (this.invBindMatrices = o.read())
                    }
            }
        }
        ,
        B.prototype.parseWeights = function(e, t) {
            for (var n, i, r = [], o = 0; o < e.childNodes.length; o++) {
                var a = e.childNodes[o];
                if (1 == a.nodeType)
                    switch (a.nodeName) {
                    case "input":
                        r.push((new Q).parse(a));
                        break;
                    case "v":
                        n = we(a.textContent);
                        break;
                    case "vcount":
                        i = we(a.textContent)
                    }
            }
            for (var s = 0, o = 0; o < i.length; o++) {
                for (var l = i[o], c = [], u = 0; l > u; u++) {
                    for (var h = {}, d = 0; d < r.length; d++) {
                        var f = r[d]
                          , p = n[s + f.offset];
                        switch (f.semantic) {
                        case "JOINT":
                            h.joint = p;
                            break;
                        case "WEIGHT":
                            h.weight = t[f.source].data[p]
                        }
                    }
                    c.push(h),
                    s += r.length
                }
                for (var u = 0; u < c.length; u++)
                    c[u].index = o;
                this.weights.push(c)
            }
        }
        ,
        D.prototype.getChildById = function(e, t) {
            for (var n = 0; n < this.nodes.length; n++) {
                var i = this.nodes[n].getChildById(e, t);
                if (i)
                    return i
            }
            return null
        }
        ,
        D.prototype.getChildBySid = function(e, t) {
            for (var n = 0; n < this.nodes.length; n++) {
                var i = this.nodes[n].getChildBySid(e, t);
                if (i)
                    return i
            }
            return null
        }
        ,
        D.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name"),
            this.nodes = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "node":
                        this.nodes.push((new I).parse(n))
                    }
            }
            return this
        }
        ,
        I.prototype.getChannelForTransform = function(e) {
            for (var t = 0; t < this.channels.length; t++) {
                var n, i, r = this.channels[t], o = r.target.split("/"), a = (o.shift(),
                o.shift()), s = a.indexOf(".") >= 0, l = a.indexOf("(") >= 0;
                if (s)
                    o = a.split("."),
                    a = o.shift(),
                    i = o.shift();
                else if (l) {
                    n = a.split("("),
                    a = n.shift();
                    for (var c = 0; c < n.length; c++)
                        n[c] = parseInt(n[c].replace(/\)/, ""))
                }
                if (a === e)
                    return r.info = {
                        sid: a,
                        dotSyntax: s,
                        arrSyntax: l,
                        arrIndices: n
                    },
                    r
            }
            return null
        }
        ,
        I.prototype.getChildById = function(e, t) {
            if (this.id === e)
                return this;
            if (t)
                for (var n = 0; n < this.nodes.length; n++) {
                    var i = this.nodes[n].getChildById(e, t);
                    if (i)
                        return i
                }
            return null
        }
        ,
        I.prototype.getChildBySid = function(e, t) {
            if (this.sid === e)
                return this;
            if (t)
                for (var n = 0; n < this.nodes.length; n++) {
                    var i = this.nodes[n].getChildBySid(e, t);
                    if (i)
                        return i
                }
            return null
        }
        ,
        I.prototype.getTransformBySid = function(e) {
            for (var t = 0; t < this.transforms.length; t++)
                if (this.transforms[t].sid === e)
                    return this.transforms[t];
            return null
        }
        ,
        I.prototype.parse = function(t) {
            var n;
            this.id = t.getAttribute("id"),
            this.sid = t.getAttribute("sid"),
            this.name = t.getAttribute("name"),
            this.type = t.getAttribute("type"),
            this.layer = t.getAttribute("layer"),
            this.type = "JOINT" === this.type ? this.type : "NODE",
            this.nodes = [],
            this.transforms = [],
            this.geometries = [],
            this.cameras = [],
            this.lights = [],
            this.controllers = [],
            this.matrix = new e.Matrix4;
            for (var i = 0; i < t.childNodes.length; i++) {
                var r = t.childNodes[i];
                if (1 == r.nodeType)
                    switch (r.nodeName) {
                    case "node":
                        this.nodes.push((new I).parse(r));
                        break;
                    case "instance_camera":
                        this.cameras.push((new he).parse(r));
                        break;
                    case "instance_controller":
                        this.controllers.push((new V).parse(r));
                        break;
                    case "instance_geometry":
                        this.geometries.push((new U).parse(r));
                        break;
                    case "instance_light":
                        this.lights.push((new fe).parse(r));
                        break;
                    case "instance_node":
                        n = r.getAttribute("url").replace(/^#/, "");
                        var o = M(n);
                        o && this.nodes.push((new I).parse(o));
                        break;
                    case "rotate":
                    case "translate":
                    case "scale":
                    case "matrix":
                    case "lookat":
                    case "skew":
                        this.transforms.push((new N).parse(r));
                        break;
                    case "extra":
                        break;
                    default:
                        console.log(r.nodeName)
                    }
            }
            return this.channels = C(this),
            T(this),
            this.updateMatrix(),
            this
        }
        ,
        I.prototype.updateMatrix = function() {
            this.matrix.identity();
            for (var e = 0; e < this.transforms.length; e++)
                this.transforms[e].apply(this.matrix)
        }
        ,
        N.prototype.clone = function() {
            return t = new N,
            t.sid = this.sid,
            t.type = this.type,
            t.data = this.data,
            t.angle = this.angle,
            this.obj && (t.obj = this.obj.clone()),
            t
        }
        ,
        N.prototype.parse = function(e) {
            return this.sid = e.getAttribute("sid"),
            this.type = e.nodeName,
            this.data = xe(e.textContent),
            this.convert(),
            this
        }
        ,
        N.prototype.convert = function() {
            switch (this.type) {
            case "matrix":
                this.obj = Le(this.data);
                break;
            case "rotate":
                this.angle = e.Math.degToRad(this.data[3]);
            case "translate":
                ke(this.data, -1),
                this.obj = new e.Vector3(this.data[0],this.data[1],this.data[2]);
                break;
            case "scale":
                ke(this.data, 1),
                this.obj = new e.Vector3(this.data[0],this.data[1],this.data[2]);
                break;
            default:
                console.log("Can not convert Transform of type " + this.type)
            }
        }
        ,
        N.prototype.apply = function() {
            var t = new e.Matrix4;
            return function(e) {
                switch (this.type) {
                case "matrix":
                    e.multiply(this.obj);
                    break;
                case "translate":
                    e.multiply(t.makeTranslation(this.obj.x, this.obj.y, this.obj.z));
                    break;
                case "rotate":
                    e.multiply(t.makeRotationAxis(this.obj, this.angle));
                    break;
                case "scale":
                    e.scale(this.obj)
                }
            }
        }(),
        N.prototype.update = function(t, n) {
            var i = ["X", "Y", "Z", "ANGLE"];
            switch (this.type) {
            case "matrix":
                if (n)
                    if (1 === n.length)
                        switch (n[0]) {
                        case 0:
                            this.obj.n11 = t[0],
                            this.obj.n21 = t[1],
                            this.obj.n31 = t[2],
                            this.obj.n41 = t[3];
                            break;
                        case 1:
                            this.obj.n12 = t[0],
                            this.obj.n22 = t[1],
                            this.obj.n32 = t[2],
                            this.obj.n42 = t[3];
                            break;
                        case 2:
                            this.obj.n13 = t[0],
                            this.obj.n23 = t[1],
                            this.obj.n33 = t[2],
                            this.obj.n43 = t[3];
                            break;
                        case 3:
                            this.obj.n14 = t[0],
                            this.obj.n24 = t[1],
                            this.obj.n34 = t[2],
                            this.obj.n44 = t[3]
                        }
                    else if (2 === n.length) {
                        var r = "n" + (n[0] + 1) + (n[1] + 1);
                        this.obj[r] = t
                    } else
                        console.log("Incorrect addressing of matrix in transform.");
                else
                    this.obj.copy(t);
                break;
            case "translate":
            case "scale":
                switch ("[object Array]" === Object.prototype.toString.call(n) && (n = i[n[0]]),
                n) {
                case "X":
                    this.obj.x = t;
                    break;
                case "Y":
                    this.obj.y = t;
                    break;
                case "Z":
                    this.obj.z = t;
                    break;
                default:
                    this.obj.x = t[0],
                    this.obj.y = t[1],
                    this.obj.z = t[2]
                }
                break;
            case "rotate":
                switch ("[object Array]" === Object.prototype.toString.call(n) && (n = i[n[0]]),
                n) {
                case "X":
                    this.obj.x = t;
                    break;
                case "Y":
                    this.obj.y = t;
                    break;
                case "Z":
                    this.obj.z = t;
                    break;
                case "ANGLE":
                    this.angle = e.Math.degToRad(t);
                    break;
                default:
                    this.obj.x = t[0],
                    this.obj.y = t[1],
                    this.obj.z = t[2],
                    this.angle = e.Math.degToRad(t[3])
                }
            }
        }
        ,
        V.prototype.parse = function(e) {
            this.url = e.getAttribute("url").replace(/^#/, ""),
            this.skeleton = [],
            this.instance_material = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 === n.nodeType)
                    switch (n.nodeName) {
                    case "skeleton":
                        this.skeleton.push(n.textContent.replace(/^#/, ""));
                        break;
                    case "bind_material":
                        for (var i = n.querySelectorAll("instance_material"), r = 0; r < i.length; r++) {
                            var o = i[r];
                            this.instance_material.push((new z).parse(o))
                        }
                        break;
                    case "extra":
                    }
            }
            return this
        }
        ,
        z.prototype.parse = function(e) {
            return this.symbol = e.getAttribute("symbol"),
            this.target = e.getAttribute("target").replace(/^#/, ""),
            this
        }
        ,
        U.prototype.parse = function(e) {
            this.url = e.getAttribute("url").replace(/^#/, ""),
            this.instance_material = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType && "bind_material" === n.nodeName) {
                    for (var i = n.querySelectorAll("instance_material"), r = 0; r < i.length; r++) {
                        var o = i[r];
                        this.instance_material.push((new z).parse(o))
                    }
                    break
                }
            }
            return this
        }
        ,
        H.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            Te(this, e);
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "mesh":
                    this.mesh = new G(this).parse(n);
                    break;
                case "extra":
                }
            }
            return this
        }
        ,
        G.prototype.parse = function(t) {
            this.primitives = [];
            for (var n = 0; n < t.childNodes.length; n++) {
                var i = t.childNodes[n];
                switch (i.nodeName) {
                case "source":
                    ye(i);
                    break;
                case "vertices":
                    this.vertices = (new Z).parse(i);
                    break;
                case "linestrips":
                    this.primitives.push((new X).parse(i));
                    break;
                case "triangles":
                    this.primitives.push((new Y).parse(i));
                    break;
                case "polygons":
                    this.primitives.push((new W).parse(i));
                    break;
                case "polylist":
                    this.primitives.push((new q).parse(i))
                }
            }
            if (this.geometry3js = new e.Geometry,
            null === this.vertices)
                return this;
            for (var r = qe[this.vertices.input.POSITION.source].data, n = 0; n < r.length; n += 3)
                this.geometry3js.vertices.push(Pe(r, n).clone());
            for (var n = 0; n < this.primitives.length; n++) {
                var o = this.primitives[n];
                o.setVertices(this.vertices),
                this.handlePrimitive(o, this.geometry3js)
            }
            return this.geometry3js.calcNormals && (this.geometry3js.computeVertexNormals(),
            delete this.geometry3js.calcNormals),
            this
        }
        ,
        G.prototype.handlePrimitive = function(t, n) {
            if (t instanceof X)
                return void (n.isLineStrip = !0);
            var i, r, o, a, s, l, c, u = t.p, h = t.inputs, d = 0, f = 3, p = 0, m = [];
            for (i = 0; i < h.length; i++) {
                o = h[i];
                var v = o.offset + 1;
                switch (p = v > p ? v : p,
                o.semantic) {
                case "TEXCOORD":
                    m.push(o.set)
                }
            }
            for (var g = 0; g < u.length; ++g)
                for (var y = u[g], b = 0; b < y.length; ) {
                    var x = []
                      , w = []
                      , _ = null
                      , S = [];
                    for (f = t.vcount ? t.vcount.length ? t.vcount[d++] : t.vcount : y.length / p,
                    i = 0; f > i; i++)
                        for (r = 0; r < h.length; r++)
                            switch (o = h[r],
                            l = qe[o.source],
                            a = y[b + i * p + o.offset],
                            c = l.accessor.params.length,
                            s = a * c,
                            o.semantic) {
                            case "VERTEX":
                                x.push(a);
                                break;
                            case "NORMAL":
                                w.push(Pe(l.data, s));
                                break;
                            case "TEXCOORD":
                                _ = _ || {},
                                void 0 === _[o.set] && (_[o.set] = []),
                                _[o.set].push(new e.Vector2(l.data[s],l.data[s + 1]));
                                break;
                            case "COLOR":
                                S.push((new e.Color).setRGB(l.data[s], l.data[s + 1], l.data[s + 2]))
                            }
                    if (0 === w.length)
                        if (o = this.vertices.input.NORMAL) {
                            l = qe[o.source],
                            c = l.accessor.params.length;
                            for (var M = 0, C = x.length; C > M; M++)
                                w.push(Pe(l.data, x[M] * c))
                        } else
                            n.calcNormals = !0;
                    if (!_ && (_ = {},
                    o = this.vertices.input.TEXCOORD)) {
                        m.push(o.set),
                        l = qe[o.source],
                        c = l.accessor.params.length;
                        for (var M = 0, C = x.length; C > M; M++)
                            s = x[M] * c,
                            void 0 === _[o.set] && (_[o.set] = []),
                            _[o.set].push(new e.Vector2(l.data[s],1 - l.data[s + 1]))
                    }
                    if (0 === S.length && (o = this.vertices.input.COLOR)) {
                        l = qe[o.source],
                        c = l.accessor.params.length;
                        for (var M = 0, C = x.length; C > M; M++)
                            s = x[M] * c,
                            S.push((new e.Color).setRGB(l.data[s], l.data[s + 1], l.data[s + 2]))
                    }
                    var T, E, k = null, A = [];
                    if (3 === f)
                        A.push(new e.Face3(x[0],x[1],x[2],w,S.length ? S : new e.Color));
                    else if (4 === f)
                        A.push(new e.Face3(x[0],x[1],x[3],[w[0].clone(), w[1].clone(), w[3].clone()],S.length ? [S[0], S[1], S[3]] : new e.Color)),
                        A.push(new e.Face3(x[1],x[2],x[3],[w[1].clone(), w[2].clone(), w[3].clone()],S.length ? [S[1], S[2], S[3]] : new e.Color));
                    else if (f > 4 && nt.subdivideFaces) {
                        var P = S.length ? S : new e.Color;
                        for (r = 1; f - 1 > r; )
                            A.push(new e.Face3(x[0],x[r],x[r + 1],[w[0].clone(), w[r++].clone(), w[r].clone()],P))
                    }
                    if (A.length)
                        for (var M = 0, C = A.length; C > M; M++)
                            for (k = A[M],
                            k.daeMaterial = t.material,
                            n.faces.push(k),
                            r = 0; r < m.length; r++)
                                T = _[m[r]],
                                E = f > 4 ? [T[0], T[M + 1], T[M + 2]] : 4 === f ? 0 === M ? [T[0], T[1], T[3]] : [T[1].clone(), T[2], T[3].clone()] : [T[0], T[1], T[2]],
                                void 0 === n.faceVertexUvs[r] && (n.faceVertexUvs[r] = []),
                                n.faceVertexUvs[r].push(E);
                    else
                        console.log("dropped face with vcount " + f + " for geometry with id: " + n.id);
                    b += p * f
                }
        }
        ,
        W.prototype.setVertices = function(e) {
            for (var t = 0; t < this.inputs.length; t++)
                this.inputs[t].source === e.id && (this.inputs[t].source = e.input.POSITION.source)
        }
        ,
        W.prototype.parse = function(e) {
            this.material = e.getAttribute("material"),
            this.count = Me(e, "count", 0);
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "input":
                    this.inputs.push((new Q).parse(e.childNodes[t]));
                    break;
                case "vcount":
                    this.vcount = we(n.textContent);
                    break;
                case "p":
                    this.p.push(we(n.textContent));
                    break;
                case "ph":
                    console.warn("polygon holes not yet supported!")
                }
            }
            return this
        }
        ,
        q.prototype = Object.create(W.prototype),
        q.prototype.constructor = q,
        X.prototype = Object.create(W.prototype),
        X.prototype.constructor = X,
        Y.prototype = Object.create(W.prototype),
        Y.prototype.constructor = Y,
        J.prototype.parse = function(e) {
            this.params = [],
            this.source = e.getAttribute("source"),
            this.count = Me(e, "count", 0),
            this.stride = Me(e, "stride", 0);
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if ("param" === n.nodeName) {
                    var i = {};
                    i.name = n.getAttribute("name"),
                    i.type = n.getAttribute("type"),
                    this.params.push(i)
                }
            }
            return this
        }
        ,
        Z.prototype.parse = function(e) {
            this.id = e.getAttribute("id");
            for (var t = 0; t < e.childNodes.length; t++)
                if ("input" === e.childNodes[t].nodeName) {
                    var n = (new Q).parse(e.childNodes[t]);
                    this.input[n.semantic] = n
                }
            return this
        }
        ,
        Q.prototype.parse = function(e) {
            return this.semantic = e.getAttribute("semantic"),
            this.source = e.getAttribute("source").replace(/^#/, ""),
            this.set = Me(e, "set", -1),
            this.offset = Me(e, "offset", 0),
            "TEXCOORD" === this.semantic && this.set < 0 && (this.set = 0),
            this
        }
        ,
        K.prototype.parse = function(e) {
            this.id = e.getAttribute("id");
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "bool_array":
                    this.data = be(n.textContent),
                    this.type = n.nodeName;
                    break;
                case "float_array":
                    this.data = xe(n.textContent),
                    this.type = n.nodeName;
                    break;
                case "int_array":
                    this.data = we(n.textContent),
                    this.type = n.nodeName;
                    break;
                case "IDREF_array":
                case "Name_array":
                    this.data = _e(n.textContent),
                    this.type = n.nodeName;
                    break;
                case "technique_common":
                    for (var i = 0; i < n.childNodes.length; i++)
                        if ("accessor" === n.childNodes[i].nodeName) {
                            this.accessor = (new J).parse(n.childNodes[i]);
                            break
                        }
                }
            }
            return this
        }
        ,
        K.prototype.read = function() {
            var e = []
              , t = this.accessor.params[0];
            switch (t.type) {
            case "IDREF":
            case "Name":
            case "name":
            case "float":
                return this.data;
            case "float4x4":
                for (var n = 0; n < this.data.length; n += 16) {
                    var i = this.data.slice(n, n + 16)
                      , r = Le(i);
                    e.push(r)
                }
                break;
            default:
                console.log("ColladaLoader: Source: Read dont know how to read " + t.type + ".")
            }
            return e
        }
        ,
        $.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name");
            for (var t = 0; t < e.childNodes.length; t++)
                if ("instance_effect" === e.childNodes[t].nodeName) {
                    this.instance_effect = (new oe).parse(e.childNodes[t]);
                    break
                }
            return this
        }
        ,
        ee.prototype.isColor = function() {
            return null === this.texture
        }
        ,
        ee.prototype.isTexture = function() {
            return null != this.texture
        }
        ,
        ee.prototype.parse = function(t) {
            "transparent" === t.nodeName && (this.opaque = t.getAttribute("opaque"));
            for (var n = 0; n < t.childNodes.length; n++) {
                var i = t.childNodes[n];
                if (1 == i.nodeType)
                    switch (i.nodeName) {
                    case "color":
                        var r = xe(i.textContent);
                        this.color = new e.Color,
                        this.color.setRGB(r[0], r[1], r[2]),
                        this.color.a = r[3];
                        break;
                    case "texture":
                        this.texture = i.getAttribute("texture"),
                        this.texcoord = i.getAttribute("texcoord"),
                        this.texOpts = {
                            offsetU: 0,
                            offsetV: 0,
                            repeatU: 1,
                            repeatV: 1,
                            wrapU: 1,
                            wrapV: 1
                        },
                        this.parseTexture(i)
                    }
            }
            return this
        }
        ,
        ee.prototype.parseTexture = function(e) {
            if (!e.childNodes)
                return this;
            e.childNodes[1] && "extra" === e.childNodes[1].nodeName && (e = e.childNodes[1],
            e.childNodes[1] && "technique" === e.childNodes[1].nodeName && (e = e.childNodes[1]));
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "offsetU":
                case "offsetV":
                case "repeatU":
                case "repeatV":
                    this.texOpts[n.nodeName] = parseFloat(n.textContent);
                    break;
                case "wrapU":
                case "wrapV":
                    "TRUE" === n.textContent.toUpperCase() ? this.texOpts[n.nodeName] = 1 : this.texOpts[n.nodeName] = parseInt(n.textContent);
                    break;
                default:
                    this.texOpts[n.nodeName] = n.textContent
                }
            }
            return this
        }
        ,
        te.prototype.parse = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "emission":
                    case "diffuse":
                    case "specular":
                    case "transparent":
                        this[n.nodeName] = (new ee).parse(n);
                        break;
                    case "bump":
                        var i = n.getAttribute("bumptype");
                        i ? "heightfield" === i.toLowerCase() ? this.bump = (new ee).parse(n) : "normalmap" === i.toLowerCase() ? this.normal = (new ee).parse(n) : (console.error("Shader.prototype.parse: Invalid value for attribute 'bumptype' (" + i + ") - valid bumptypes are 'HEIGHTFIELD' and 'NORMALMAP' - defaulting to 'HEIGHTFIELD'"),
                        this.bump = (new ee).parse(n)) : (console.warn("Shader.prototype.parse: Attribute 'bumptype' missing from bump node - defaulting to 'HEIGHTFIELD'"),
                        this.bump = (new ee).parse(n));
                        break;
                    case "shininess":
                    case "reflectivity":
                    case "index_of_refraction":
                    case "transparency":
                        var r = n.querySelectorAll("float");
                        r.length > 0 && (this[n.nodeName] = parseFloat(r[0].textContent))
                    }
            }
            return this.create(),
            this
        }
        ,
        te.prototype.create = function() {
            var t = {}
              , n = !1;
            if (void 0 !== this.transparency && void 0 !== this.transparent) {
                var i = (this.transparent,
                (this.transparent.color.r + this.transparent.color.g + this.transparent.color.b) / 3 * this.transparency);
                i > 0 && (n = !0,
                t.transparent = !0,
                t.opacity = 1 - i)
            }
            var r = {
                diffuse: "map",
                ambient: "lightMap",
                specular: "specularMap",
                emission: "emissionMap",
                bump: "bumpMap",
                normal: "normalMap"
            };
            for (var o in this)
                switch (o) {
                case "ambient":
                case "emission":
                case "diffuse":
                case "specular":
                case "bump":
                case "normal":
                    var a = this[o];
                    if (a instanceof ee)
                        if (a.isTexture()) {
                            var s = a.texture
                              , l = this.effect.sampler[s];
                            if (void 0 !== l && void 0 !== l.source) {
                                var c = this.effect.surface[l.source];
                                if (void 0 !== c) {
                                    var u = Xe[c.init_from];
                                    if (u) {
                                        var h, d = Ve + u.init_from, f = e.Loader.Handlers.get(d);
                                        null !== f ? h = f.load(d) : (h = new e.Texture,
                                        Ce(h, d)),
                                        h.wrapS = a.texOpts.wrapU ? e.RepeatWrapping : e.ClampToEdgeWrapping,
                                        h.wrapT = a.texOpts.wrapV ? e.RepeatWrapping : e.ClampToEdgeWrapping,
                                        h.offset.x = a.texOpts.offsetU,
                                        h.offset.y = a.texOpts.offsetV,
                                        h.repeat.x = a.texOpts.repeatU,
                                        h.repeat.y = a.texOpts.repeatV,
                                        t[r[o]] = h,
                                        "emission" === o && (t.emissive = 16777215)
                                    }
                                }
                            }
                        } else
                            "diffuse" !== o && n || ("emission" === o ? t.emissive = a.color.getHex() : t[o] = a.color.getHex());
                    break;
                case "shininess":
                    t[o] = this[o];
                    break;
                case "reflectivity":
                    t[o] = this[o],
                    t[o] > 0 && (t.envMap = nt.defaultEnvMap),
                    t.combine = e.MixOperation;
                    break;
                case "index_of_refraction":
                    t.refractionRatio = this[o],
                    1 !== this[o] && (t.envMap = nt.defaultEnvMap);
                    break;
                case "transparency":
                }
            switch (t.shading = tt,
            t.side = this.effect.doubleSided ? e.DoubleSide : e.FrontSide,
            this.type) {
            case "constant":
                void 0 != t.emissive && (t.color = t.emissive),
                this.material = new e.MeshBasicMaterial(t);
                break;
            case "phong":
            case "blinn":
                void 0 != t.diffuse && (t.color = t.diffuse),
                this.material = new e.MeshPhongMaterial(t);
                break;
            case "lambert":
            default:
                void 0 != t.diffuse && (t.color = t.diffuse),
                this.material = new e.MeshLambertMaterial(t)
            }
            return this.material
        }
        ,
        ne.prototype.parse = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "init_from":
                        this.init_from = n.textContent;
                        break;
                    case "format":
                        this.format = n.textContent;
                        break;
                    default:
                        console.log("unhandled Surface prop: " + n.nodeName)
                    }
            }
            return this
        }
        ,
        ie.prototype.parse = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "source":
                        this.source = n.textContent;
                        break;
                    case "minfilter":
                        this.minfilter = n.textContent;
                        break;
                    case "magfilter":
                        this.magfilter = n.textContent;
                        break;
                    case "mipfilter":
                        this.mipfilter = n.textContent;
                        break;
                    case "wrap_s":
                        this.wrap_s = n.textContent;
                        break;
                    case "wrap_t":
                        this.wrap_t = n.textContent;
                        break;
                    default:
                        console.log("unhandled Sampler2D prop: " + n.nodeName)
                    }
            }
            return this
        }
        ,
        re.prototype.create = function() {
            return null === this.shader ? null : void 0
        }
        ,
        re.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name"),
            Te(this, e),
            this.shader = null;
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "profile_COMMON":
                        this.parseTechnique(this.parseProfileCOMMON(n))
                    }
            }
            return this
        }
        ,
        re.prototype.parseNewparam = function(e) {
            for (var t = e.getAttribute("sid"), n = 0; n < e.childNodes.length; n++) {
                var i = e.childNodes[n];
                if (1 == i.nodeType)
                    switch (i.nodeName) {
                    case "surface":
                        this.surface[t] = new ne(this).parse(i);
                        break;
                    case "sampler2D":
                        this.sampler[t] = new ie(this).parse(i);
                        break;
                    case "extra":
                        break;
                    default:
                        console.log(i.nodeName)
                    }
            }
        }
        ,
        re.prototype.parseProfileCOMMON = function(e) {
            for (var t, n = 0; n < e.childNodes.length; n++) {
                var i = e.childNodes[n];
                if (1 == i.nodeType)
                    switch (i.nodeName) {
                    case "profile_COMMON":
                        this.parseProfileCOMMON(i);
                        break;
                    case "technique":
                        t = i;
                        break;
                    case "newparam":
                        this.parseNewparam(i);
                        break;
                    case "image":
                        var r = (new O).parse(i);
                        Xe[r.id] = r;
                        break;
                    case "extra":
                        break;
                    default:
                        console.log(i.nodeName)
                    }
            }
            return t
        }
        ,
        re.prototype.parseTechnique = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "constant":
                    case "lambert":
                    case "blinn":
                    case "phong":
                        this.shader = new te(n.nodeName,this).parse(n);
                        break;
                    case "extra":
                        this.parseExtra(n)
                    }
            }
        }
        ,
        re.prototype.parseExtra = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "technique":
                        this.parseExtraTechnique(n)
                    }
            }
        }
        ,
        re.prototype.parseExtraTechnique = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "bump":
                        this.shader.parse(e)
                    }
            }
        }
        ,
        oe.prototype.parse = function(e) {
            return this.url = e.getAttribute("url").replace(/^#/, ""),
            this
        }
        ,
        ae.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name"),
            this.source = {};
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "animation":
                        var i = (new ae).parse(n);
                        for (var r in i.source)
                            this.source[r] = i.source[r];
                        for (var o = 0; o < i.channel.length; o++)
                            this.channel.push(i.channel[o]),
                            this.sampler.push(i.sampler[o]);
                        break;
                    case "source":
                        var r = (new K).parse(n);
                        this.source[r.id] = r;
                        break;
                    case "sampler":
                        this.sampler.push(new le(this).parse(n));
                        break;
                    case "channel":
                        this.channel.push(new se(this).parse(n))
                    }
            }
            return this
        }
        ,
        se.prototype.parse = function(e) {
            this.source = e.getAttribute("source").replace(/^#/, ""),
            this.target = e.getAttribute("target");
            var t = this.target.split("/")
              , n = (t.shift(),
            t.shift())
              , i = n.indexOf(".") >= 0
              , r = n.indexOf("(") >= 0;
            if (i)
                t = n.split("."),
                this.sid = t.shift(),
                this.member = t.shift();
            else if (r) {
                var o = n.split("(");
                this.sid = o.shift();
                for (var a = 0; a < o.length; a++)
                    o[a] = parseInt(o[a].replace(/\)/, ""));
                this.arrIndices = o
            } else
                this.sid = n;
            return this.fullSid = n,
            this.dotSyntax = i,
            this.arrSyntax = r,
            this
        }
        ,
        le.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.inputs = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "input":
                        this.inputs.push((new Q).parse(n))
                    }
            }
            return this
        }
        ,
        le.prototype.create = function() {
            for (var e = 0; e < this.inputs.length; e++) {
                var t = this.inputs[e]
                  , n = this.animation.source[t.source];
                switch (t.semantic) {
                case "INPUT":
                    this.input = n.read();
                    break;
                case "OUTPUT":
                    this.output = n.read(),
                    this.strideOut = n.accessor.stride;
                    break;
                case "INTERPOLATION":
                    this.interpolation = n.read();
                    break;
                case "IN_TANGENT":
                    break;
                case "OUT_TANGENT":
                    break;
                default:
                    console.log(t.semantic)
                }
            }
            if (this.startTime = 0,
            this.endTime = 0,
            this.duration = 0,
            this.input.length) {
                this.startTime = 1e8,
                this.endTime = -1e8;
                for (var e = 0; e < this.input.length; e++)
                    this.startTime = Math.min(this.startTime, this.input[e]),
                    this.endTime = Math.max(this.endTime, this.input[e]);
                this.duration = this.endTime - this.startTime
            }
        }
        ,
        le.prototype.getData = function(e, t, n) {
            var i;
            if ("matrix" === e && 16 === this.strideOut)
                i = this.output[t];
            else if (this.strideOut > 1) {
                i = [],
                t *= this.strideOut;
                for (var r = 0; r < this.strideOut; ++r)
                    i[r] = this.output[t + r];
                if (3 === this.strideOut)
                    switch (e) {
                    case "rotate":
                    case "translate":
                        ke(i, -1);
                        break;
                    case "scale":
                        ke(i, 1)
                    }
                else
                    4 === this.strideOut && "matrix" === e && ke(i, -1)
            } else
                i = this.output[t],
                n && "translate" === e && (i = Ae(n, i));
            return i
        }
        ,
        ce.prototype.addTarget = function(e, t, n, i) {
            this.targets.push({
                sid: e,
                member: n,
                transform: t,
                data: i
            })
        }
        ,
        ce.prototype.apply = function(e) {
            for (var t = 0; t < this.targets.length; ++t) {
                var n = this.targets[t];
                e && n.sid !== e || n.transform.update(n.data, n.member)
            }
        }
        ,
        ce.prototype.getTarget = function(e) {
            for (var t = 0; t < this.targets.length; ++t)
                if (this.targets[t].sid === e)
                    return this.targets[t];
            return null
        }
        ,
        ce.prototype.hasTarget = function(e) {
            for (var t = 0; t < this.targets.length; ++t)
                if (this.targets[t].sid === e)
                    return !0;
            return !1
        }
        ,
        ce.prototype.interpolate = function(e, t) {
            for (var n = 0, i = this.targets.length; i > n; n++) {
                var r, o = this.targets[n], a = e.getTarget(o.sid);
                if ("matrix" !== o.transform.type && a) {
                    var s = (t - this.time) / (e.time - this.time)
                      , l = a.data
                      , c = o.data;
                    if (0 > s && (s = 0),
                    s > 1 && (s = 1),
                    c.length) {
                        r = [];
                        for (var u = 0; u < c.length; ++u)
                            r[u] = c[u] + (l[u] - c[u]) * s
                    } else
                        r = c + (l - c) * s
                } else
                    r = o.data;
                o.transform.update(r, o.member)
            }
        }
        ,
        ue.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name");
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "optics":
                        this.parseOptics(n)
                    }
            }
            return this
        }
        ,
        ue.prototype.parseOptics = function(e) {
            for (var t = 0; t < e.childNodes.length; t++)
                if ("technique_common" === e.childNodes[t].nodeName)
                    for (var n = e.childNodes[t], i = 0; i < n.childNodes.length; i++)
                        if (this.technique = n.childNodes[i].nodeName,
                        "perspective" === this.technique)
                            for (var r = n.childNodes[i], o = 0; o < r.childNodes.length; o++) {
                                var a = r.childNodes[o];
                                switch (a.nodeName) {
                                case "yfov":
                                    this.yfov = a.textContent;
                                    break;
                                case "xfov":
                                    this.xfov = a.textContent;
                                    break;
                                case "znear":
                                    this.znear = a.textContent;
                                    break;
                                case "zfar":
                                    this.zfar = a.textContent;
                                    break;
                                case "aspect_ratio":
                                    this.aspect_ratio = a.textContent
                                }
                            }
                        else if ("orthographic" === this.technique)
                            for (var s = n.childNodes[i], o = 0; o < s.childNodes.length; o++) {
                                var a = s.childNodes[o];
                                switch (a.nodeName) {
                                case "xmag":
                                    this.xmag = a.textContent;
                                    break;
                                case "ymag":
                                    this.ymag = a.textContent;
                                    break;
                                case "znear":
                                    this.znear = a.textContent;
                                    break;
                                case "zfar":
                                    this.zfar = a.textContent;
                                    break;
                                case "aspect_ratio":
                                    this.aspect_ratio = a.textContent
                                }
                            }
            return this
        }
        ,
        he.prototype.parse = function(e) {
            return this.url = e.getAttribute("url").replace(/^#/, ""),
            this
        }
        ,
        de.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name");
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "technique_common":
                        this.parseCommon(n);
                        break;
                    case "technique":
                        this.parseTechnique(n)
                    }
            }
            return this
        }
        ,
        de.prototype.parseCommon = function(t) {
            for (var n = 0; n < t.childNodes.length; n++)
                switch (t.childNodes[n].nodeName) {
                case "directional":
                case "point":
                case "spot":
                case "ambient":
                    this.technique = t.childNodes[n].nodeName;
                    for (var i = t.childNodes[n], r = 0; r < i.childNodes.length; r++) {
                        var o = i.childNodes[r];
                        switch (o.nodeName) {
                        case "color":
                            var a = xe(o.textContent);
                            this.color = new e.Color(0),
                            this.color.setRGB(a[0], a[1], a[2]),
                            this.color.a = a[3];
                            break;
                        case "falloff_angle":
                            this.falloff_angle = parseFloat(o.textContent);
                            break;
                        case "quadratic_attenuation":
                            var s = parseFloat(o.textContent);
                            this.distance = s ? Math.sqrt(1 / s) : 0
                        }
                    }
                }
            return this
        }
        ,
        de.prototype.parseTechnique = function(e) {
            this.profile = e.getAttribute("profile");
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                switch (n.nodeName) {
                case "intensity":
                    this.intensity = parseFloat(n.textContent)
                }
            }
            return this
        }
        ,
        fe.prototype.parse = function(e) {
            return this.url = e.getAttribute("url").replace(/^#/, ""),
            this
        }
        ,
        pe.prototype.parse = function(e) {
            this.id = e.getAttribute("id"),
            this.name = e.getAttribute("name"),
            this.joints = [],
            this.links = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "technique_common":
                        this.parseCommon(n)
                    }
            }
            return this
        }
        ,
        pe.prototype.parseCommon = function(e) {
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (e.childNodes[t].nodeName) {
                    case "joint":
                        this.joints.push((new me).parse(n));
                        break;
                    case "link":
                        this.links.push((new ve).parse(n))
                    }
            }
            return this
        }
        ,
        me.prototype.parse = function(t) {
            this.sid = t.getAttribute("sid"),
            this.name = t.getAttribute("name"),
            this.axis = new e.Vector3,
            this.limits = {
                min: 0,
                max: 0
            },
            this.type = "",
            this["static"] = !1,
            this.zeroPosition = 0,
            this.middlePosition = 0;
            var n = t.querySelector("axis")
              , i = xe(n.textContent);
            this.axis = Pe(i, 0);
            var r = t.querySelector("limits min") ? parseFloat(t.querySelector("limits min").textContent) : -360
              , o = t.querySelector("limits max") ? parseFloat(t.querySelector("limits max").textContent) : 360;
            this.limits = {
                min: r,
                max: o
            };
            for (var a = ["prismatic", "revolute"], s = 0; s < a.length; s++) {
                var l = a[s]
                  , c = t.querySelector(l);
                c && (this.type = l)
            }
            return this.limits.min >= this.limits.max && (this["static"] = !0),
            this.middlePosition = (this.limits.min + this.limits.max) / 2,
            this
        }
        ,
        ve.prototype.parse = function(e) {
            this.sid = e.getAttribute("sid"),
            this.name = e.getAttribute("name"),
            this.transforms = [],
            this.attachments = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "attachment_full":
                        this.attachments.push((new ge).parse(n));
                        break;
                    case "rotate":
                    case "translate":
                    case "matrix":
                        this.transforms.push((new N).parse(n))
                    }
            }
            return this
        }
        ,
        ge.prototype.parse = function(e) {
            this.joint = e.getAttribute("joint").split("/").pop(),
            this.links = [];
            for (var t = 0; t < e.childNodes.length; t++) {
                var n = e.childNodes[t];
                if (1 == n.nodeType)
                    switch (n.nodeName) {
                    case "link":
                        this.links.push((new ve).parse(n));
                        break;
                    case "rotate":
                    case "translate":
                    case "matrix":
                        this.transforms.push((new N).parse(n))
                    }
            }
            return this
        }
        ,
        {
            load: n,
            parse: i,
            setPreferredShading: r,
            applySkin: x,
            geometries: Ze,
            options: nt
        }
    }
//}
