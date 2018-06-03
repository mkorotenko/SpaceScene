var i = function() {
    function t() {}
    return t.replaceColorGradient = function(e, t, n, i, r, o, a) {
        for (var s = e.getAttribute("color"), l = s.length / 18, c = 0, u = 1 / (l + 1), h = t.clone(), d = s.array, f = 0; l > f; f++) {
            var p = 18 * f;
            o && a > c ? (d[p + 0] = d[p + 3] = d[p + 15] = o.r,
            d[p + 1] = d[p + 4] = d[p + 16] = o.g,
            d[p + 2] = d[p + 5] = d[p + 17] = o.b,
            d[p + 6] = d[p + 9] = d[p + 12] = o.r,
            d[p + 7] = d[p + 10] = d[p + 13] = o.g,
            d[p + 8] = d[p + 11] = d[p + 14] = o.b,
            c += u,
            h = t.clone().lerp(n, c)) : c > r ? (d[p + 0] = d[p + 3] = d[p + 15] = i.r,
            d[p + 1] = d[p + 4] = d[p + 16] = i.g,
            d[p + 2] = d[p + 5] = d[p + 17] = i.b,
            d[p + 6] = d[p + 9] = d[p + 12] = i.r,
            d[p + 7] = d[p + 10] = d[p + 13] = i.g,
            d[p + 8] = d[p + 11] = d[p + 14] = i.b) : (d[p + 0] = d[p + 3] = d[p + 15] = h.r,
            d[p + 1] = d[p + 4] = d[p + 16] = h.g,
            d[p + 2] = d[p + 5] = d[p + 17] = h.b,
            c += u,
            h = t.clone().lerp(n, c),
            d[p + 6] = d[p + 9] = d[p + 12] = h.r,
            d[p + 7] = d[p + 10] = d[p + 13] = h.g,
            d[p + 8] = d[p + 11] = d[p + 14] = h.b)
        }
        s.needsUpdate = !0
    }
    ,
    t.makeLineGeometry = function(t, n, i, r, o) {
        for (var a = i ? t.length - 1 : t.length / 2, s = new Float32Array(18 * a), l = new Float32Array(18 * a), c = new Float32Array(12 * a), u = 0; a > u; u++) {
            var h = i ? u : 2 * u
              , d = 18 * u
              , f = 12 * u
              , p = t[h]
              , m = t[h + 1]
              , v = (new e.Vector3).subVectors(m, p).normalize();
            n ? (c[f + 0] = c[f + 2] = c[f + 10] = n[h],
            c[f + 6] = c[f + 8] = c[f + 4] = n[h + 1]) : (c[f + 0] = c[f + 2] = c[f + 10] = 0,
            c[f + 6] = c[f + 8] = c[f + 4] = 1),
            c[f + 1] = c[f + 5] = c[f + 9] = 0,
            c[f + 3] = c[f + 7] = c[f + 11] = 1,
            s[d + 0] = s[d + 3] = s[d + 15] = p.x,
            s[d + 1] = s[d + 4] = s[d + 16] = p.y,
            s[d + 2] = s[d + 5] = s[d + 17] = p.z,
            s[d + 6] = s[d + 9] = s[d + 12] = m.x,
            s[d + 7] = s[d + 10] = s[d + 13] = m.y,
            s[d + 8] = s[d + 11] = s[d + 14] = m.z,
            l[d + 0] = l[d + 3] = l[d + 6] = l[d + 9] = l[d + 12] = l[d + 15] = v.x,
            l[d + 1] = l[d + 4] = l[d + 7] = l[d + 10] = l[d + 13] = l[d + 16] = v.y,
            l[d + 2] = l[d + 5] = l[d + 8] = l[d + 11] = l[d + 14] = l[d + 17] = v.z
        }
        var g = new e.BufferGeometry;
        if (g.addAttribute("position", new e.BufferAttribute(s,3)),
        g.addAttribute("normal", new e.BufferAttribute(l,3)),
        g.addAttribute("uv", new e.BufferAttribute(c,2)),
        r) {
            o = o || r;
            for (var y = new Float32Array(18 * a), b = 0, x = 1 / (a + 1), w = r.clone(), u = 0; a > u; u++) {
                var d = 18 * u;
                y[d + 0] = y[d + 3] = y[d + 15] = w.r,
                y[d + 1] = y[d + 4] = y[d + 16] = w.g,
                y[d + 2] = y[d + 5] = y[d + 17] = w.b,
                b += x,
                w = r.clone().lerp(o, b),
                y[d + 6] = y[d + 9] = y[d + 12] = w.r,
                y[d + 7] = y[d + 10] = y[d + 13] = w.g,
                y[d + 8] = y[d + 11] = y[d + 14] = w.b
            }
            g.addAttribute("color", new e.BufferAttribute(y,3))
        }
        return g.computeBoundingSphere(),
        g.computeBoundingBox(),
        g
    }
    ,
    t.makeCircleGeometry = function(t, n, i, r) {
        void 0 === t && (t = 1),
        void 0 === n && (n = 32);
        for (var o = n, a = new Float32Array(18 * o), s = new Float32Array(18 * o), l = new Float32Array(12 * o), c = 0; o > c; c++) {
            var u = c
              , h = 18 * c
              , d = 12 * c
              , f = 2 * Math.PI * u / n
              , p = 2 * Math.PI * (u + 1) / n
              , m = Math.sin(f)
              , v = Math.cos(f)
              , g = Math.sin(p)
              , y = Math.cos(p);
            l[d + 0] = l[d + 2] = l[d + 4] = l[d + 6] = l[d + 8] = l[d + 12] = .5,
            l[d + 1] = l[d + 5] = l[d + 9] = 0,
            l[d + 3] = l[d + 7] = l[d + 11] = 1,
            a[h + 0] = a[h + 3] = a[h + 15] = t * m,
            a[h + 1] = a[h + 4] = a[h + 16] = t * v,
            a[h + 2] = a[h + 5] = a[h + 17] = 0,
            a[h + 6] = a[h + 9] = a[h + 12] = t * g,
            a[h + 7] = a[h + 10] = a[h + 13] = t * y,
            a[h + 8] = a[h + 11] = a[h + 14] = 0,
            s[h + 0] = s[h + 3] = s[h + 15] = v,
            s[h + 1] = s[h + 4] = s[h + 16] = -m,
            s[h + 2] = s[h + 5] = s[h + 17] = 0,
            s[h + 6] = s[h + 9] = s[h + 12] = y,
            s[h + 7] = s[h + 10] = s[h + 13] = -g,
            s[h + 8] = s[h + 11] = s[h + 14] = 0
        }
        var b = new e.BufferGeometry;
        if (b.addAttribute("position", new e.BufferAttribute(a,3)),
        b.addAttribute("normal", new e.BufferAttribute(s,3)),
        b.addAttribute("uv", new e.BufferAttribute(l,2)),
        i) {
            r = r || i;
            for (var x = new Float32Array(18 * o), w = 0, _ = 1 / (o + 1), S = i.clone(), c = 0; o > c; c++) {
                var h = 18 * c;
                x[h + 0] = x[h + 3] = x[h + 15] = S.r,
                x[h + 1] = x[h + 4] = x[h + 16] = S.g,
                x[h + 2] = x[h + 5] = x[h + 17] = S.b,
                w += _,
                S = i.clone().lerp(r, w),
                x[h + 6] = x[h + 9] = x[h + 12] = S.r,
                x[h + 7] = x[h + 10] = x[h + 13] = S.g,
                x[h + 8] = x[h + 11] = x[h + 14] = S.b
            }
            b.addAttribute("color", new e.BufferAttribute(x,3))
        }
        return b.computeBoundingSphere(),
        b.computeBoundingBox(),
        b
    }
    ,
    t.makeCurveGeometry = function(t, n, i, r) {
        var o = 2 * (n + 1)
          , a = new Float32Array(3 * o)
          , s = new Float32Array(3 * o)
          , l = new Float32Array(2 * o)
          , c = new Uint16Array(6 * n)
          , u = new e.BufferGeometry;
        u.addAttribute("position", new e.BufferAttribute(a,3)),
        u.addAttribute("normal", new e.BufferAttribute(s,3)),
        u.addAttribute("uv", new e.BufferAttribute(l,2)),
        u.addAttribute("index", new e.BufferAttribute(c,3));
        for (var h = 0; n >= h; h++) {
            var d = h / n
              , f = t.getPoint(d)
              , p = t.getTangent(d)
              , m = 6 * h
              , v = 4 * h;
            l[v + 0] = l[v + 2] = d * i;
            1 / r(d);
            l[v + 1] = 0,
            l[v + 3] = 1,
            a[m + 0] = a[m + 3] = f.x,
            a[m + 1] = a[m + 4] = f.y,
            a[m + 2] = a[m + 5] = f.z,
            s[m + 0] = s[m + 3] = p.x,
            s[m + 1] = s[m + 4] = p.y,
            s[m + 2] = s[m + 5] = p.z
        }
        if (r) {
            var g = new Float32Array(o);
            u.addAttribute("relThickness", new e.BufferAttribute(g,1));
            for (var h = 0; n >= h; h++) {
                var d = h / n
                  , m = 2 * h;
                g[m] = g[m + 1] = r(d)
            }
        }
        for (var h = 0; n > h; h++) {
            var m = 6 * h
              , v = 2 * h;
            c[m + 0] = v + 0,
            c[m + 1] = v + 1,
            c[m + 2] = v + 2,
            c[m + 3] = v + 3,
            c[m + 4] = v + 2,
            c[m + 5] = v + 1
        }
        return u
    }
    ,
    t.make2DCircleMesh = function(n, i, r, o) {
        return void 0 === n && (n = 1),
        void 0 === i && (i = 32),
        new e.Mesh(t.makeCircleGeometry(n, i),t.makeThinline2DMaterial(r, o))
    }
    ,
    t.makeThinline2DAdditiveMaterial = function(i, r) {
        if (void 0 !== r && t.convertedMaterials[r.uuid])
            return t.convertedMaterials[r.uuid];
        i = i || {};
        var o = new e.ShaderMaterial({
            uniforms: {
                color: {
                    type: "c",
                    value: i.color ? new e.Color(i.color) : new e.Color(1,1,1)
                },
                intensity: {
                    type: "f",
                    value: i.intensity || 1
                },
                resolution: {
                    type: "v2",
                    value: new e.Vector2(window.innerWidth,window.innerHeight)
                }
            },
            vertexShader: n(33),
            fragmentShader: n(34)
        });
        return o.transparent = !0,
        o.blending = e.AdditiveBlending,
        o.depthTest = !1,
        o.depthWrite = !1,
        null != r && (o.name = r.name,
        t.convertedMaterials[r.uuid] = o),
        o
    }
    ,
    t.makeThinline2DMaterial = function(n, i) {
        var r = t.makeThinline2DAdditiveMaterial(n, i);
        return r.blending = e.CustomBlending,
        r.blendEquation = e.AddEquation,
        r.blendSrc = e.SrcAlphaFactor,
        r.blendDst = e.OneMinusSrcAlphaFactor,
        r
    }
    ,
    t.makeThinline2DBeginEndMaterial = function(t) {
        t = t || {};
        var i = new e.ShaderMaterial({
            uniforms: {
                color: {
                    type: "c",
                    value: t.color ? new e.Color(t.color) : new e.Color(1,1,1)
                },
                intensity: {
                    type: "f",
                    value: t.intensity || 1
                },
                length: {
                    type: "f",
                    value: t.intensity || 1
                },
                begin: {
                    type: "f",
                    value: t.intensity || 0
                },
                end: {
                    type: "f",
                    value: t.intensity || 0
                },
                resolution: {
                    type: "v2",
                    value: new e.Vector2(window.innerWidth,window.innerHeight)
                }
            },
            vertexShader: n(35),
            fragmentShader: n(36)
        });
        return i.transparent = !0,
        i.depthTest = !1,
        i.depthWrite = !1,
        i.blending = e.CustomBlending,
        i.blendEquation = e.AddEquation,
        i.blendSrc = e.SrcAlphaFactor,
        i.blendDst = e.OneMinusSrcAlphaFactor,
        i
    }
    ,
    t.makeRouteMaterial = function(t, i, r) {
        var o = new e.ShaderMaterial({
            uniforms: {
                time: {
                    type: "f",
                    value: 0
                },
                devicePixelRatio: {
                    type: "f",
                    value: i
                },
                resolution: {
                    type: "v2",
                    value: new e.Vector2(window.innerWidth,window.innerHeight)
                },
                intensity: {
                    type: "f",
                    value: 1
                },
                length: {
                    type: "f",
                    value: 1
                },
                twoways: {
                    type: "f",
                    value: t ? -1 : 1
                },
                color: {
                    type: "c",
                    value: new e.Color(r.color || "rgb(80,20,0)")
                },
                colorBorder: {
                    type: "c",
                    value: new e.Color(r.colorBorder || "rgb(100,40,0)")
                },
                width: {
                    type: "f",
                    value: r.width
                },
                size: {
                    type: "f",
                    value: r.size
                },
                density: {
                    type: "f",
                    value: r.density
                },
                speed: {
                    type: "f",
                    value: r.speed
                },
                side: {
                    type: "f",
                    value: r.side
                },
                center: {
                    type: "f",
                    value: r.center
                },
                presence: {
                    type: "f",
                    value: 1
                },
                highlight: {
                    type: "f",
                    value: 0
                },
                highlightFactor: {
                    type: "f",
                    value: .5
                },
                depthFactor: {
                    type: "f",
                    value: .1
                },
                pitchEffect: {
                    type: "f",
                    value: r.pitchEffect
                },
                pitchIntensity: {
                    type: "f",
                    value: r.pitchIntensity
                }
            },
            attributes: {
                relThickness: {
                    type: "f",
                    value: []
                }
            },
            vertexShader: n(37),
            fragmentShader: n(38)
        });
        return o.transparent = !0,
        o.blending = e.AdditiveBlending,
        o.depthTest = !1,
        o.depthWrite = !1,
        o
    }
    ,
    t.makeVertexColoredThinline2DMaterial = function(i, r) {
        if (void 0 !== r && t.convertedMaterials[r.uuid])
            return t.convertedMaterials[r.uuid];
        i = i || {};
        var o = new e.ShaderMaterial({
            uniforms: {
                intensity: {
                    type: "f",
                    value: i.intensity || 1
                },
                resolution: {
                    type: "v2",
                    value: new e.Vector2(window.innerWidth,window.innerHeight)
                }
            },
            vertexShader: n(39),
            fragmentShader: n(40)
        });
        return o.transparent = !0,
        o.blending = e.CustomBlending,
        o.blendEquation = e.AddEquation,
        o.blendSrc = e.SrcAlphaFactor,
        o.blendDst = e.OneMinusSrcAlphaFactor,
        o.depthTest = !0,
        o.depthWrite = !1,
        null != r && (o.name = r.name,
        t.convertedMaterials[r.uuid] = o),
        o
    }
    ,
    t.makeBasicVertexColoredMaterial = function(i) {
        if (void 0 !== i && t.convertedMaterials[i.uuid])
            return t.convertedMaterials[i.uuid];
        var r = new e.ShaderMaterial({
            vertexShader: n(41),
            fragmentShader: n(42)
        });
        return r.transparent = !0,
        r.blending = e.AdditiveBlending,
        r.depthTest = !1,
        r.depthWrite = !1,
        null != i && (r.name = i.name,
        t.convertedMaterials[i.uuid] = r),
        r
    }
    ,
    t.makeLineMesh = function(n, i, r) {
        return new e.Mesh(t.makeLineGeometry(n),t.makeThinline3DMaterial(i, r))
    }
    ,
    t.convertContourMeshIntoLineMesh = function(n) {
        if (n instanceof e.Mesh) {
            if (n.geometry instanceof e.Geometry) {
                for (var i = n.geometry, r = i.faces, o = i.vertices, a = o.length, s = [], l = 0; l < r.length; l++) {
                    var c = r[l];
                    s.push(c.a),
                    s.push(c.b),
                    s.push(c.c)
                }
                for (var u = {}, h = [], d = [], f = 0; f < s.length; f += 3)
                    for (var p = f; f + 3 > p; p++) {
                        var m = s[p]
                          , v = s[f + (p + 1) % 3]
                          , g = s[f + (p + 2) % 3]
                          , y = o[m]
                          , b = o[v]
                          , x = o[g]
                          , w = y.distanceToSquared(b);
                        if (w > y.distanceToSquared(x) || w > b.distanceToSquared(x)) {
                            var _ = m + a * v
                              , S = v + a * m;
                            if (void 0 !== u[S]) {
                                var M = u[S]
                                  , C = M - M % 3
                                  , T = s[C + (M + 2) % 3]
                                  , E = o[T];
                                y.distanceToSquared(x) < b.distanceToSquared(x) ? (h.push((new e.Vector3).addVectors(y, x).multiplyScalar(.5)),
                                h.push((new e.Vector3).addVectors(b, E).multiplyScalar(.5))) : (h.push((new e.Vector3).addVectors(y, E).multiplyScalar(.5)),
                                h.push((new e.Vector3).addVectors(b, x).multiplyScalar(.5)))
                            } else
                                u[_] = p
                        }
                    }
                var k = n.material.color.clone()
                  , A = Math.max(k.r, k.g, k.b);
                return A > 0 && k.multiplyScalar(1 / A),
                t.makeLineMesh(h, t.materialParams[n.material.name] || {
                    color: k.getHex(),
                    intensity: A
                }, n.material)
            }
            if (n.geometry instanceof e.BufferGeometry) {
                var i = n.geometry;
                if (i.getAttribute("index")) {
                    for (var P = i.getAttribute("position").array, a = P.length / 3, s = i.getAttribute("index").array, L = i.getAttribute("uv").array, u = {}, h = [], d = [], y = new e.Vector3, b = new e.Vector3, x = new e.Vector3, E = new e.Vector3, f = 0; f < s.length; f += 3)
                        for (var p = f; f + 3 > p; p++) {
                            var m = s[p]
                              , v = s[f + (p + 1) % 3]
                              , g = s[f + (p + 2) % 3]
                              , O = 3 * m
                              , R = 3 * v
                              , F = 3 * g;
                            y.set(P[O], P[O + 1], P[O + 2]),
                            b.set(P[R], P[R + 1], P[R + 2]),
                            x.set(P[F], P[F + 1], P[F + 2]);
                            var B = L[2 * m]
                              , D = L[2 * v]
                              , w = y.distanceToSquared(b);
                            if (w > y.distanceToSquared(x) || w > b.distanceToSquared(x)) {
                                var _ = m + a * v
                                  , S = v + a * m;
                                if (void 0 !== u[S]) {
                                    var M = u[S]
                                      , C = M - M % 3
                                      , T = s[C + (M + 2) % 3]
                                      , I = 3 * T;
                                    E.set(P[I], P[I + 1], P[I + 2]),
                                    d.push(B),
                                    d.push(D),
                                    y.distanceToSquared(x) < b.distanceToSquared(x) ? (h.push((new e.Vector3).addVectors(y, x).multiplyScalar(.5)),
                                    h.push((new e.Vector3).addVectors(b, E).multiplyScalar(.5))) : (h.push((new e.Vector3).addVectors(y, E).multiplyScalar(.5)),
                                    h.push((new e.Vector3).addVectors(b, x).multiplyScalar(.5)))
                                } else
                                    u[_] = p
                            }
                        }
                    var k = n.material.color.clone()
                      , A = Math.max(k.r, k.g, k.b);
                    return A > 0 && k.multiplyScalar(1 / A),
                    new e.Mesh(t.makeLineGeometry(h, d),t.makeThinline3DMaterial(t.materialParams[n.material.name] || {
                        color: k.getHex(),
                        intensity: A
                    }, n.material))
                }
                return console.log("BufferGeometry without index, do nothing!!!"),
                n
            }
            throw new Error("Expecting a THREE.Geometry")
        }
        throw new Error("Expecting a THREE.Mesh")
    }
    ,
    t.convertMeshesWithThinlineMaterial = function(n) {
        var i = [];
        n.traverse(function(t) {
            t instanceof e.Mesh && t.material && t.material.name && 0 === t.material.name.indexOf("Thinline") && i.push(t)
        });
        for (var r = 0; r < i.length; r++) {
            var o = i[r]
              , a = t.convertContourMeshIntoLineMesh(o);
            o.parent.add(a),
            o.parent.remove(o)
        }
    }
    ,
    t.replaceMaterial = function(t, n, i) {
        t.traverse(function(t) {
            if (t instanceof e.Mesh && t.material && t.material.name && t.material.name === n) {
                var r = t;
                r.material = i
            }
        })
    }
    ,
    t.getMaterial = function(t, n) {
        var i = null;
        return t.traverse(function(t) {
            if (t instanceof e.Mesh && t.material && t.material.name && t.material.name === n) {
                var r = t;
                i = r.material
            }
        }),
        i
    }
    ,
    t.getMaterialStartingWith = function(t, n) {
        var i = {};
        return t.traverse(function(t) {
            if (t instanceof e.Mesh && t.material && t.material.name && 0 === t.material.name.indexOf(n)) {
                var r = t;
                i[r.material.name] = r.material
            }
        }),
        i
    }
    ,
    t.convertIncludedAdditiveMaterial = function(n) {
        n.traverse(function(n) {
            if (n instanceof e.Mesh && n.material && n.material.name && 0 === n.material.name.indexOf("Additive"))
                if (n.geometry instanceof e.Geometry && n.geometry.faces[0].vertexColors.length) {
                    n.material = t.makeBasicVertexColoredMaterial(n.material);
                    var i = new e.BufferGeometry
                      , r = n.geometry;
                    i.fromGeometry(r);
                    for (var o = new Float32Array(9 * r.faces.length), a = 0; a < r.faces.length; a++) {
                        var s = 9 * a
                          , l = r.faces[a];
                        o[s] = l.vertexColors[0].r,
                        o[s + 1] = l.vertexColors[0].g,
                        o[s + 2] = l.vertexColors[0].b,
                        o[s + 3] = l.vertexColors[1].r,
                        o[s + 4] = l.vertexColors[1].g,
                        o[s + 5] = l.vertexColors[1].b,
                        o[s + 6] = l.vertexColors[2].r,
                        o[s + 7] = l.vertexColors[2].g,
                        o[s + 8] = l.vertexColors[2].b
                    }
                    i.addAttribute("color", new e.BufferAttribute(o,3)),
                    n.geometry = i
                } else if (n.geometry instanceof e.BufferGeometry && n.geometry.getAttribute("color")) {
                    var i = n.geometry;
                    n.material = t.makeBasicVertexColoredMaterial(n.material)
                } else {
                    var c = n.material;
                    c.transparent = !0,
                    c.blending = e.AdditiveBlending,
                    c.depthTest = !1,
                    c.depthWrite = !1
                }
        })
    }
    ,
    t.collapseMaterialsPerName = function(t) {
        var n = {};
        t.traverse(function(t) {
            if (t instanceof e.Mesh && t.material && t.material.name) {
                var i = t.material;
                n[i.name] ? t.material = n[i.name] : n[i.name] = i
            }
        })
    }
    ,
    t.updateMaterialsResolution = function(t, n, i) {
        t.traverse(function(t) {
            t instanceof e.Mesh && t.material && t.material.uniforms && void 0 !== t.material.uniforms.resolution && t.material.uniforms.resolution.value instanceof e.Vector2 && t.material.uniforms.resolution.value.set(n, i)
        })
    }
    ,
    t.appendGUI = function(t, n) {
        var i = function() {
            return n ? n.name ? n.name : n.children && n.children[0] ? n.children[0].name : null : null
        }
          , r = t.addFolder(i() || "Object")
          , o = {};
        r.add(n, "visible"),
        n.traverse(function(t) {
            if (t instanceof e.Mesh && t.material) {
                if (t.material.uniforms && !o[t.material.uuid]) {
                    var n = t.material
                      , i = n.uniforms
                      , a = r.addFolder(n.name)
                      , s = {};
                    o[n.uuid] = !0,
                    i.color && (s.color = i.color.value.getStyle(),
                    a.addColor(s, "color").onChange(function(e) {
                        i.color.value.setStyle(e)
                    })),
                    i.intensity && (s.intensity = i.intensity.value,
                    a.add(s, "intensity", 0, 1).onChange(function(e) {
                        i.intensity.value = e
                    })),
                    i.fadeBack && (s.fadeBack = i.fadeBack.value,
                    a.add(s, "fadeBack", 0, 1).onChange(function(e) {
                        i.fadeBack.value = e
                    })),
                    i.radiusAndInvRadius && (s.radius = i.radiusAndInvRadius.value.x,
                    a.add(s, "radius").min(1e-4).onChange(function(e) {
                        i.radiusAndInvRadius.value.x = e,
                        i.radiusAndInvRadius.value.y = 1 / e
                    })),
                    i.depth && (s.depthMin = i.depth.value.x,
                    s.depthMax = i.depth.value.y,
                    a.add(s, "depthMin").onChange(function(e) {
                        i.depth.value.x = e
                    }),
                    a.add(s, "depthMax").onChange(function(e) {
                        i.depth.value.y = e
                    })),
                    i.fade && (s.fadeMin = i.fade.value.x,
                    s.fadeMax = i.fade.value.y,
                    a.add(s, "fadeMin", 0, 1).onChange(function(e) {
                        i.fade.value.x = e
                    }),
                    a.add(s, "fadeMax", 0, 1).onChange(function(e) {
                        i.fade.value.y = e
                    }))
                }
                if (t.material.name && 0 === t.material.name.indexOf("Additive") && !o[t.material.uuid]) {
                    var n = t.material
                      , a = r.addFolder(n.name)
                      , s = {};
                    o[n.uuid] = !0,
                    s.color = n.color.getStyle(),
                    a.addColor(s, "color").onChange(function(e) {
                        n.color.setStyle(e)
                    })
                }
            }
        })
    }
    ,
    t.version = 1,
    t.convertedMaterials = {},
    t.materialParams = {
        ThinlineGrid: {
            color: "#96a5ff",
            intensity: .36,
            fadeBack: 1,
            depthMax: 10,
            fadeMax: .2
        }
    },
    t.makeThinline3DMaterial = function(i, r) {
        if (void 0 !== r && t.convertedMaterials[r.uuid])
            return t.convertedMaterials[r.uuid];
        i = i || {};
        var o = new e.ShaderMaterial({
            uniforms: {
                color: {
                    type: "c",
                    value: i.color ? new e.Color(i.color) : new e.Color(1,1,1)
                },
                intensity: {
                    type: "f",
                    value: i.intensity || 1
                },
                resolution: {
                    type: "v2",
                    value: new e.Vector2(window.innerWidth,window.innerHeight)
                },
                fadeBack: {
                    type: "f",
                    value: i.fadeBack || 0
                },
                radiusAndInvRadius: {
                    type: "v2",
                    value: i.radiusAndInvRadius || new e.Vector2(1,1)
                },
                fade: {
                    type: "v2",
                    value: new e.Vector2(i.fadeMin || 1,i.fadeMax || 1)
                },
                depth: {
                    type: "v2",
                    value: new e.Vector2(i.depthMin || 0,i.depthMax || 1)
                }
            },
            vertexShader: n(43),
            fragmentShader: n(44)
        });
        return o.transparent = !0,
        o.blending = e.CustomBlending,
        o.blendEquation = e.AddEquation,
        o.blendSrc = e.SrcAlphaFactor,
        o.blendDst = e.OneMinusSrcAlphaFactor,
        o.depthTest = !1,
        o.depthWrite = !1,
        null != r && (o.name = r.name,
        t.convertedMaterials[r.uuid] = o),
        o
    }
    ,
    t
}();
module.exports = {
    default: i,
};
