import "./chunk-WDMUDEB6.js";

// node_modules/wavesurfer.js/dist/plugins/envelope.esm.js
var t = class {
  constructor() {
    this.listeners = {};
  }
  on(t2, e2, i2) {
    if (this.listeners[t2] || (this.listeners[t2] = /* @__PURE__ */ new Set()), this.listeners[t2].add(e2), null == i2 ? void 0 : i2.once) {
      const i3 = () => {
        this.un(t2, i3), this.un(t2, e2);
      };
      return this.on(t2, i3), i3;
    }
    return () => this.un(t2, e2);
  }
  un(t2, e2) {
    var i2;
    null === (i2 = this.listeners[t2]) || void 0 === i2 || i2.delete(e2);
  }
  once(t2, e2) {
    return this.on(t2, e2, { once: true });
  }
  unAll() {
    this.listeners = {};
  }
  emit(t2, ...e2) {
    this.listeners[t2] && this.listeners[t2].forEach((t3) => t3(...e2));
  }
};
var e = class extends t {
  constructor(t2) {
    super(), this.subscriptions = [], this.options = t2;
  }
  onInit() {
  }
  _init(t2) {
    this.wavesurfer = t2, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach((t2) => t2());
  }
};
function i(t2, e2, i2, o2, n2 = 3, s2 = 0, r2 = 100) {
  if (!t2) return () => {
  };
  const l2 = matchMedia("(pointer: coarse)").matches;
  let a = () => {
  };
  const h = (h2) => {
    if (h2.button !== s2) return;
    h2.preventDefault(), h2.stopPropagation();
    let u = h2.clientX, c = h2.clientY, d = false;
    const p = Date.now(), m = (o3) => {
      if (o3.preventDefault(), o3.stopPropagation(), l2 && Date.now() - p < r2) return;
      const s3 = o3.clientX, a2 = o3.clientY, h3 = s3 - u, m2 = a2 - c;
      if (d || Math.abs(h3) > n2 || Math.abs(m2) > n2) {
        const o4 = t2.getBoundingClientRect(), { left: n3, top: r3 } = o4;
        d || (null == i2 || i2(u - n3, c - r3), d = true), e2(h3, m2, s3 - n3, a2 - r3), u = s3, c = a2;
      }
    }, v = (e3) => {
      if (d) {
        const i3 = e3.clientX, n3 = e3.clientY, s3 = t2.getBoundingClientRect(), { left: r3, top: l3 } = s3;
        null == o2 || o2(i3 - r3, n3 - l3);
      }
      a();
    }, g = (t3) => {
      t3.relatedTarget && t3.relatedTarget !== document.documentElement || v(t3);
    }, f = (t3) => {
      d && (t3.stopPropagation(), t3.preventDefault());
    }, y = (t3) => {
      d && t3.preventDefault();
    };
    document.addEventListener("pointermove", m), document.addEventListener("pointerup", v), document.addEventListener("pointerout", g), document.addEventListener("pointercancel", g), document.addEventListener("touchmove", y, { passive: false }), document.addEventListener("click", f, { capture: true }), a = () => {
      document.removeEventListener("pointermove", m), document.removeEventListener("pointerup", v), document.removeEventListener("pointerout", g), document.removeEventListener("pointercancel", g), document.removeEventListener("touchmove", y), setTimeout(() => {
        document.removeEventListener("click", f, { capture: true });
      }, 10);
    };
  };
  return t2.addEventListener("pointerdown", h), () => {
    a(), t2.removeEventListener("pointerdown", h);
  };
}
function o(t2, e2) {
  const i2 = e2.xmlns ? document.createElementNS(e2.xmlns, t2) : document.createElement(t2);
  for (const [t3, n2] of Object.entries(e2)) if ("children" === t3 && n2) for (const [t4, e3] of Object.entries(n2)) e3 instanceof Node ? i2.appendChild(e3) : "string" == typeof e3 ? i2.appendChild(document.createTextNode(e3)) : i2.appendChild(o(t4, e3));
  else "style" === t3 ? Object.assign(i2.style, n2) : "textContent" === t3 ? i2.textContent = n2 : i2.setAttribute(t3, n2.toString());
  return i2;
}
function n(t2, e2, i2) {
  const n2 = o(t2, e2 || {});
  return null == i2 || i2.appendChild(n2), n2;
}
var s = { points: [], lineWidth: 4, lineColor: "rgba(0, 0, 255, 0.5)", dragPointSize: 10, dragPointFill: "rgba(255, 255, 255, 0.8)", dragPointStroke: "rgba(255, 255, 255, 0.8)" };
var r = class extends t {
  constructor(t2, e2) {
    super(), this.subscriptions = [], this.subscriptions = [], this.options = t2, this.polyPoints = /* @__PURE__ */ new Map();
    const o2 = e2.clientWidth, s2 = e2.clientHeight, r2 = n("svg", { xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", viewBox: `0 0 ${o2} ${s2}`, preserveAspectRatio: "none", style: { position: "absolute", left: "0", top: "0", zIndex: "4" }, part: "envelope" }, e2);
    this.svg = r2;
    const l2 = n("polyline", { xmlns: "http://www.w3.org/2000/svg", points: `0,${s2} ${o2},${s2}`, stroke: t2.lineColor, "stroke-width": t2.lineWidth, fill: "none", part: "polyline", style: t2.dragLine ? { cursor: "row-resize", pointerEvents: "stroke" } : {} }, r2);
    t2.dragLine && this.subscriptions.push(i(l2, (t3, e3) => {
      const { height: i2 } = r2.viewBox.baseVal, { points: o3 } = l2;
      for (let t4 = 1; t4 < o3.numberOfItems - 1; t4++) {
        const n3 = o3.getItem(t4);
        n3.y = Math.min(i2, Math.max(0, n3.y + e3));
      }
      const n2 = r2.querySelectorAll("ellipse");
      Array.from(n2).forEach((t4) => {
        const o4 = Math.min(i2, Math.max(0, Number(t4.getAttribute("cy")) + e3));
        t4.setAttribute("cy", o4.toString());
      }), this.emit("line-move", e3 / i2);
    })), r2.addEventListener("dblclick", (t3) => {
      const e3 = r2.getBoundingClientRect(), i2 = t3.clientX - e3.left, o3 = t3.clientY - e3.top;
      this.emit("point-create", i2 / e3.width, o3 / e3.height);
    });
    {
      let t3;
      const e3 = () => clearTimeout(t3);
      r2.addEventListener("touchstart", (i2) => {
        1 === i2.touches.length ? t3 = window.setTimeout(() => {
          i2.preventDefault();
          const t4 = r2.getBoundingClientRect(), e4 = i2.touches[0].clientX - t4.left, o3 = i2.touches[0].clientY - t4.top;
          this.emit("point-create", e4 / t4.width, o3 / t4.height);
        }, 500) : e3();
      }), r2.addEventListener("touchmove", e3), r2.addEventListener("touchend", e3);
    }
  }
  makeDraggable(t2, e2) {
    this.subscriptions.push(i(t2, e2, () => t2.style.cursor = "grabbing", () => t2.style.cursor = "grab", 1));
  }
  createCircle(t2, e2) {
    const i2 = this.options.dragPointSize / 2;
    return n("ellipse", { xmlns: "http://www.w3.org/2000/svg", cx: t2, cy: e2, rx: i2, ry: i2, fill: this.options.dragPointFill, stroke: this.options.dragPointStroke, "stroke-width": "2", style: { cursor: "grab", pointerEvents: "all" }, part: "envelope-circle" }, this.svg);
  }
  removePolyPoint(t2) {
    const e2 = this.polyPoints.get(t2);
    if (!e2) return;
    const { polyPoint: i2, circle: o2 } = e2, { points: n2 } = this.svg.querySelector("polyline"), s2 = Array.from(n2).findIndex((t3) => t3.x === i2.x && t3.y === i2.y);
    n2.removeItem(s2), o2.remove(), this.polyPoints.delete(t2);
  }
  addPolyPoint(t2, e2, i2) {
    const { svg: o2 } = this, { width: n2, height: s2 } = o2.viewBox.baseVal, r2 = t2 * n2, l2 = s2 - e2 * s2, a = this.options.dragPointSize / 2, h = o2.createSVGPoint();
    h.x = t2 * n2, h.y = s2 - e2 * s2;
    const u = this.createCircle(r2, l2), { points: c } = o2.querySelector("polyline"), d = Array.from(c).findIndex((t3) => t3.x >= r2);
    c.insertItemBefore(h, Math.max(d, 1)), this.polyPoints.set(i2, { polyPoint: h, circle: u }), this.makeDraggable(u, (t3, e3) => {
      const o3 = h.x + t3, r3 = h.y + e3;
      if (o3 < -a || r3 < -a || o3 > n2 + a || r3 > s2 + a) return void this.emit("point-dragout", i2);
      const l3 = Array.from(c).find((t4) => t4.x > h.x), d2 = Array.from(c).findLast((t4) => t4.x < h.x);
      l3 && o3 >= l3.x || d2 && o3 <= d2.x || (h.x = o3, h.y = r3, u.setAttribute("cx", o3.toString()), u.setAttribute("cy", r3.toString()), this.emit("point-move", i2, o3 / n2, r3 / s2));
    });
  }
  update() {
    const { svg: t2 } = this, e2 = t2.viewBox.baseVal.width / t2.clientWidth, i2 = t2.viewBox.baseVal.height / t2.clientHeight;
    t2.querySelectorAll("ellipse").forEach((t3) => {
      const o2 = this.options.dragPointSize / 2, n2 = o2 * e2, s2 = o2 * i2;
      t3.setAttribute("rx", n2.toString()), t3.setAttribute("ry", s2.toString());
    });
  }
  destroy() {
    this.subscriptions.forEach((t2) => t2()), this.polyPoints.clear(), this.svg.remove();
  }
};
var l = class _l extends e {
  constructor(t2) {
    super(t2), this.polyline = null, this.throttleTimeout = null, this.volume = 1, this.points = t2.points || [], this.options = Object.assign({}, s, t2), this.options.lineColor = this.options.lineColor || s.lineColor, this.options.dragPointFill = this.options.dragPointFill || s.dragPointFill, this.options.dragPointStroke = this.options.dragPointStroke || s.dragPointStroke, this.options.dragPointSize = this.options.dragPointSize || s.dragPointSize;
  }
  static create(t2) {
    return new _l(t2);
  }
  addPoint(t2) {
    var e2;
    t2.id || (t2.id = Math.random().toString(36).slice(2));
    const i2 = this.points.findLastIndex((e3) => e3.time < t2.time);
    this.points.splice(i2 + 1, 0, t2), this.emitPoints();
    const o2 = null === (e2 = this.wavesurfer) || void 0 === e2 ? void 0 : e2.getDuration();
    o2 && this.addPolyPoint(t2, o2);
  }
  removePoint(t2) {
    var e2;
    const i2 = this.points.indexOf(t2);
    i2 > -1 && (this.points.splice(i2, 1), null === (e2 = this.polyline) || void 0 === e2 || e2.removePolyPoint(t2), this.emitPoints());
  }
  getPoints() {
    return this.points;
  }
  setPoints(t2) {
    this.points.slice().forEach((t3) => this.removePoint(t3)), t2.forEach((t3) => this.addPoint(t3));
  }
  destroy() {
    var t2;
    null === (t2 = this.polyline) || void 0 === t2 || t2.destroy(), super.destroy();
  }
  getCurrentVolume() {
    return this.volume;
  }
  setVolume(t2) {
    var e2;
    this.volume = t2, null === (e2 = this.wavesurfer) || void 0 === e2 || e2.setVolume(t2);
  }
  onInit() {
    var t2;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const { options: e2 } = this;
    e2.volume = null !== (t2 = e2.volume) && void 0 !== t2 ? t2 : this.wavesurfer.getVolume(), this.setVolume(e2.volume), this.subscriptions.push(this.wavesurfer.on("decode", (t3) => {
      this.initPolyline(), this.points.forEach((e3) => {
        this.addPolyPoint(e3, t3);
      });
    }), this.wavesurfer.on("redraw", () => {
      var t3;
      null === (t3 = this.polyline) || void 0 === t3 || t3.update();
    }), this.wavesurfer.on("timeupdate", (t3) => {
      this.onTimeUpdate(t3);
    }));
  }
  emitPoints() {
    this.throttleTimeout && clearTimeout(this.throttleTimeout), this.throttleTimeout = setTimeout(() => {
      this.emit("points-change", this.points);
    }, 200);
  }
  initPolyline() {
    if (this.polyline && this.polyline.destroy(), !this.wavesurfer) return;
    const t2 = this.wavesurfer.getWrapper();
    this.polyline = new r(this.options, t2), this.subscriptions.push(this.polyline.on("point-move", (t3, e2, i2) => {
      var o2;
      const n2 = (null === (o2 = this.wavesurfer) || void 0 === o2 ? void 0 : o2.getDuration()) || 0;
      t3.time = e2 * n2, t3.volume = 1 - i2, this.emitPoints();
    }), this.polyline.on("point-dragout", (t3) => {
      this.removePoint(t3);
    }), this.polyline.on("point-create", (t3, e2) => {
      var i2;
      this.addPoint({ time: t3 * ((null === (i2 = this.wavesurfer) || void 0 === i2 ? void 0 : i2.getDuration()) || 0), volume: 1 - e2 });
    }), this.polyline.on("line-move", (t3) => {
      var e2;
      this.points.forEach((e3) => {
        e3.volume = Math.min(1, Math.max(0, e3.volume - t3));
      }), this.emitPoints(), this.onTimeUpdate((null === (e2 = this.wavesurfer) || void 0 === e2 ? void 0 : e2.getCurrentTime()) || 0);
    }));
  }
  addPolyPoint(t2, e2) {
    var i2;
    null === (i2 = this.polyline) || void 0 === i2 || i2.addPolyPoint(t2.time / e2, t2.volume, t2);
  }
  onTimeUpdate(t2) {
    if (!this.wavesurfer) return;
    let e2 = this.points.find((e3) => e3.time > t2);
    e2 || (e2 = { time: this.wavesurfer.getDuration() || 0, volume: 0 });
    let i2 = this.points.findLast((e3) => e3.time <= t2);
    i2 || (i2 = { time: 0, volume: 0 });
    const o2 = e2.time - i2.time, n2 = e2.volume - i2.volume, s2 = i2.volume + (t2 - i2.time) * (n2 / o2), r2 = Math.min(1, Math.max(0, s2)), l2 = Math.round(100 * r2) / 100;
    l2 !== this.getCurrentVolume() && (this.setVolume(l2), this.emit("volume-change", l2));
  }
};
export {
  l as default
};
//# sourceMappingURL=wavesurfer__js_dist_plugins_envelope__js.js.map
