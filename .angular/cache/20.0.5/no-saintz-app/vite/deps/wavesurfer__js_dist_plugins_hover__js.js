import "./chunk-WDMUDEB6.js";

// node_modules/wavesurfer.js/dist/plugins/hover.esm.js
var t = class {
  constructor() {
    this.listeners = {};
  }
  on(t2, e2, s2) {
    if (this.listeners[t2] || (this.listeners[t2] = /* @__PURE__ */ new Set()), this.listeners[t2].add(e2), null == s2 ? void 0 : s2.once) {
      const s3 = () => {
        this.un(t2, s3), this.un(t2, e2);
      };
      return this.on(t2, s3), s3;
    }
    return () => this.un(t2, e2);
  }
  un(t2, e2) {
    var s2;
    null === (s2 = this.listeners[t2]) || void 0 === s2 || s2.delete(e2);
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
function s(t2, e2) {
  const i2 = e2.xmlns ? document.createElementNS(e2.xmlns, t2) : document.createElement(t2);
  for (const [t3, n2] of Object.entries(e2)) if ("children" === t3 && n2) for (const [t4, e3] of Object.entries(n2)) e3 instanceof Node ? i2.appendChild(e3) : "string" == typeof e3 ? i2.appendChild(document.createTextNode(e3)) : i2.appendChild(s(t4, e3));
  else "style" === t3 ? Object.assign(i2.style, n2) : "textContent" === t3 ? i2.textContent = n2 : i2.setAttribute(t3, n2.toString());
  return i2;
}
function i(t2, e2, i2) {
  const n2 = s(t2, e2 || {});
  return null == i2 || i2.appendChild(n2), n2;
}
var n = { lineWidth: 1, labelSize: 11, labelPreferLeft: false, formatTimeCallback: (t2) => `${Math.floor(t2 / 60)}:${`0${Math.floor(t2) % 60}`.slice(-2)}` };
var o = class _o extends e {
  constructor(t2) {
    super(t2 || {}), this.unsubscribe = () => {
    }, this.onPointerMove = (t3) => {
      if (!this.wavesurfer) return;
      const e2 = this.wavesurfer.getWrapper().getBoundingClientRect(), { width: s2 } = e2, i2 = t3.clientX - e2.left, n2 = Math.min(1, Math.max(0, i2 / s2)), o2 = Math.min(s2 - this.options.lineWidth - 1, i2);
      this.wrapper.style.transform = `translateX(${o2}px)`, this.wrapper.style.opacity = "1";
      const r = this.wavesurfer.getDuration() || 0;
      this.label.textContent = this.options.formatTimeCallback(r * n2);
      const a = this.label.offsetWidth, l = this.options.labelPreferLeft ? o2 - a > 0 : o2 + a > s2;
      this.label.style.transform = l ? `translateX(-${a + this.options.lineWidth}px)` : "", this.emit("hover", n2);
    }, this.onPointerLeave = () => {
      this.wrapper.style.opacity = "0";
    }, this.options = Object.assign({}, n, t2), this.wrapper = i("div", { part: "hover" }), this.label = i("span", { part: "hover-label" }, this.wrapper);
  }
  static create(t2) {
    return new _o(t2);
  }
  addUnits(t2) {
    return `${t2}${"number" == typeof t2 ? "px" : ""}`;
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const t2 = this.wavesurfer.options, e2 = this.options.lineColor || t2.cursorColor || t2.progressColor;
    Object.assign(this.wrapper.style, { position: "absolute", zIndex: 10, left: 0, top: 0, height: "100%", pointerEvents: "none", borderLeft: `${this.addUnits(this.options.lineWidth)} solid ${e2}`, opacity: "0", transition: "opacity .1s ease-in" }), Object.assign(this.label.style, { display: "block", backgroundColor: this.options.labelBackground, color: this.options.labelColor, fontSize: `${this.addUnits(this.options.labelSize)}`, transition: "transform .1s ease-in", padding: "2px 3px" });
    const s2 = this.wavesurfer.getWrapper();
    s2.appendChild(this.wrapper), s2.addEventListener("pointermove", this.onPointerMove), s2.addEventListener("pointerleave", this.onPointerLeave), s2.addEventListener("wheel", this.onPointerMove), this.unsubscribe = () => {
      s2.removeEventListener("pointermove", this.onPointerMove), s2.removeEventListener("pointerleave", this.onPointerLeave), s2.removeEventListener("wheel", this.onPointerMove);
    };
  }
  destroy() {
    super.destroy(), this.unsubscribe(), this.wrapper.remove();
  }
};
export {
  o as default
};
//# sourceMappingURL=wavesurfer__js_dist_plugins_hover__js.js.map
