var n = function(e) {
    for (var t = 0; t < e.keys.length; t++)
        e.keys[t].time < 0 && (e.keys[t].time = 0),
        e.keys[t].index = t;
    return e
}
  , i = function() {
    function e(t, i) {
        this.root = t,
        i instanceof e ? (this.duration = i.duration,
        this.data = i.data,
        this.timeScale = i.timeScale,
        this.loop = i.loop) : (this.duration = i.length,
        this.data = n(i.hierarchy[0]),
        this.timeScale = 1,
        this.loop = !0),
        this.currentTime = 0,
        this.isPlaying = !1,
        this.isPaused = !0,
        this.transforms = [],
        this.animatedTransforms = [],
        this.prevKey = null,
        this.nextKey = null,
        this.init()
    }
    return e.prototype.init = function() {
        for (var e = 0, t = this.data.node.transforms.length; t > e; e++)
            this.transforms.push(this.data.node.transforms[e].clone());
        for (var n = this.data.keys[0], e = 0, i = n.targets.length; i > e; e++)
            for (var r = n.targets[e], o = 0, a = this.data.node.transforms.length; a > o; o++) {
                var s = this.data.node.transforms[o];
                s === r.transform && this.animatedTransforms.push(this.transforms[o])
            }
        this.root.matrixAutoUpdate = !1,
        this.root.matrixWorldNeedsUpdate = !0,
        this.update(0)
    }
    ,
    e.prototype.clone = function(t) {
        return new e(t,this)
    }
    ,
    e.prototype.play = function(e) {
        if (void 0 === e && (e = 0),
        this.currentTime = void 0 !== e ? e : 0,
        this.isPlaying === !1) {
            this.isPlaying = !0;
            var t, n;
            t = this.root,
            n = this.data;
            var i = this.data.keys;
            i.length && (this.prevKey = i[0],
            this.nextKey = i[1]),
            this.update(0)
        }
        this.isPaused = !1
    }
    ,
    e.prototype.stop = function() {
        this.isPlaying = !1,
        this.isPaused = !1
    }
    ,
    e.prototype.update = function(e) {
        if (this.isPlaying !== !1) {
            this.currentTime += e * this.timeScale;
            var t = this.duration;
            this.loop === !0 && this.currentTime > t && (this.currentTime %= t),
            this.currentTime = Math.min(this.currentTime, t);
            var n = this.data
              , i = n.keys;
            if (i.length && i.length > 1) {
                var r = this.prevKey
                  , o = this.nextKey;
                if (this.currentTime < r.time && (this.prevKey = r = i[0],
                this.nextKey = o = i[1]),
                o.time <= this.currentTime) {
                    for (; o.time < this.currentTime && o.index > r.index; )
                        r = o,
                        o = i[r.index + 1];
                    this.prevKey = r,
                    this.nextKey = o
                }
                o.time >= this.currentTime ? this.key_interpolate(r, o, this.currentTime) : this.key_interpolate(r, o, o.time),
                this.updateMatrix()
            }
        }
    }
    ,
    e.prototype.updateMatrix = function() {
        this.root.matrix.identity();
        for (var e = 0; e < this.transforms.length; e++)
            this.transforms[e].apply(this.root.matrix);
        this.root.matrixWorldNeedsUpdate = !0
    }
    ,
    e.prototype.key_interpolate = function(e, t, n) {
        for (var i = 0, r = e.targets.length; r > i; i++) {
            var o, a = e.targets[i], s = t.targets[i], l = this.animatedTransforms[i];
            if ("matrix" !== l.type && s) {
                var c = (n - e.time) / (t.time - e.time)
                  , u = s.data
                  , h = a.data;
                if (0 > c && (c = 0),
                c > 1 && (c = 1),
                h.length) {
                    o = [];
                    for (var d = 0; d < h.length; ++d)
                        o[d] = h[d] + (u[d] - h[d]) * c
                } else
                    o = h + (u - h) * c
            } else
                o = a.data;
            l.update(o, a.member)
        }
    }
    ,
    e
}()

export default i;
