import "./chunk-WDMUDEB6.js";

// node_modules/wavesurfer.js/dist/plugins/spectrogram.esm.js
function t(t2, e2, s2, r2) {
  return new (s2 || (s2 = Promise))(function(i2, a2) {
    function n2(t3) {
      try {
        o(r2.next(t3));
      } catch (t4) {
        a2(t4);
      }
    }
    function h2(t3) {
      try {
        o(r2.throw(t3));
      } catch (t4) {
        a2(t4);
      }
    }
    function o(t3) {
      var e3;
      t3.done ? i2(t3.value) : (e3 = t3.value, e3 instanceof s2 ? e3 : new s2(function(t4) {
        t4(e3);
      })).then(n2, h2);
    }
    o((r2 = r2.apply(t2, e2 || [])).next());
  });
}
var e = class {
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
var s = class extends e {
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
function r(t2, e2) {
  const s2 = e2.xmlns ? document.createElementNS(e2.xmlns, t2) : document.createElement(t2);
  for (const [t3, i2] of Object.entries(e2)) if ("children" === t3 && i2) for (const [t4, e3] of Object.entries(i2)) e3 instanceof Node ? s2.appendChild(e3) : "string" == typeof e3 ? s2.appendChild(document.createTextNode(e3)) : s2.appendChild(r(t4, e3));
  else "style" === t3 ? Object.assign(s2.style, i2) : "textContent" === t3 ? s2.textContent = i2 : s2.setAttribute(t3, i2.toString());
  return s2;
}
function i(t2, e2, s2) {
  const i2 = r(t2, e2 || {});
  return null == s2 || s2.appendChild(i2), i2;
}
function a(t2, e2, s2, r2) {
  switch (this.bufferSize = t2, this.sampleRate = e2, this.bandwidth = 2 / t2 * (e2 / 2), this.sinTable = new Float32Array(t2), this.cosTable = new Float32Array(t2), this.windowValues = new Float32Array(t2), this.reverseTable = new Uint32Array(t2), this.peakBand = 0, this.peak = 0, s2) {
    case "bartlett":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 2 / (t2 - 1) * ((t2 - 1) / 2 - Math.abs(i2 - (t2 - 1) / 2));
      break;
    case "bartlettHann":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 0.62 - 0.48 * Math.abs(i2 / (t2 - 1) - 0.5) - 0.38 * Math.cos(2 * Math.PI * i2 / (t2 - 1));
      break;
    case "blackman":
      for (r2 = r2 || 0.16, i2 = 0; i2 < t2; i2++) this.windowValues[i2] = (1 - r2) / 2 - 0.5 * Math.cos(2 * Math.PI * i2 / (t2 - 1)) + r2 / 2 * Math.cos(4 * Math.PI * i2 / (t2 - 1));
      break;
    case "cosine":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = Math.cos(Math.PI * i2 / (t2 - 1) - Math.PI / 2);
      break;
    case "gauss":
      for (r2 = r2 || 0.25, i2 = 0; i2 < t2; i2++) this.windowValues[i2] = Math.pow(Math.E, -0.5 * Math.pow((i2 - (t2 - 1) / 2) / (r2 * (t2 - 1) / 2), 2));
      break;
    case "hamming":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 0.54 - 0.46 * Math.cos(2 * Math.PI * i2 / (t2 - 1));
      break;
    case "hann":
    case void 0:
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 0.5 * (1 - Math.cos(2 * Math.PI * i2 / (t2 - 1)));
      break;
    case "lanczoz":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = Math.sin(Math.PI * (2 * i2 / (t2 - 1) - 1)) / (Math.PI * (2 * i2 / (t2 - 1) - 1));
      break;
    case "rectangular":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 1;
      break;
    case "triangular":
      for (i2 = 0; i2 < t2; i2++) this.windowValues[i2] = 2 / t2 * (t2 / 2 - Math.abs(i2 - (t2 - 1) / 2));
      break;
    default:
      throw Error("No such window function '" + s2 + "'");
  }
  for (var i2, a2 = 1, n2 = t2 >> 1; a2 < t2; ) {
    for (i2 = 0; i2 < a2; i2++) this.reverseTable[i2 + a2] = this.reverseTable[i2] + n2;
    a2 <<= 1, n2 >>= 1;
  }
  for (i2 = 0; i2 < t2; i2++) this.sinTable[i2] = Math.sin(-Math.PI / i2), this.cosTable[i2] = Math.cos(-Math.PI / i2);
  this.calculateSpectrum = function(t3) {
    var e3, s3, r3, i3 = this.bufferSize, a3 = this.cosTable, n3 = this.sinTable, h2 = this.reverseTable, o = new Float32Array(i3), l = new Float32Array(i3), c = 2 / this.bufferSize, u = Math.sqrt, f = new Float32Array(i3 / 2), p = Math.floor(Math.log(i3) / Math.LN2);
    if (Math.pow(2, p) !== i3) throw "Invalid buffer size, must be a power of 2.";
    if (i3 !== t3.length) throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + i3 + " Buffer Size: " + t3.length;
    for (var d, w, g, b, M, m, v, y, T = 1, k = 0; k < i3; k++) o[k] = t3[h2[k]] * this.windowValues[h2[k]], l[k] = 0;
    for (; T < i3; ) {
      d = a3[T], w = n3[T], g = 1, b = 0;
      for (var z = 0; z < T; z++) {
        for (k = z; k < i3; ) m = g * o[M = k + T] - b * l[M], v = g * l[M] + b * o[M], o[M] = o[k] - m, l[M] = l[k] - v, o[k] += m, l[k] += v, k += T << 1;
        g = (y = g) * d - b * w, b = y * w + b * d;
      }
      T <<= 1;
    }
    k = 0;
    for (var F = i3 / 2; k < F; k++) (r3 = c * u((e3 = o[k]) * e3 + (s3 = l[k]) * s3)) > this.peak && (this.peakBand = k, this.peak = r3), f[k] = r3;
    return f;
  };
}
var n = 1e3 * Math.log(10) / 107.939;
var h = class _h extends s {
  static create(t2) {
    return new _h(t2 || {});
  }
  constructor(t2) {
    var e2, s2;
    if (super(t2), this.frequenciesDataUrl = t2.frequenciesDataUrl, this.container = "string" == typeof t2.container ? document.querySelector(t2.container) : t2.container, t2.colorMap && "string" != typeof t2.colorMap) {
      if (t2.colorMap.length < 256) throw new Error("Colormap must contain 256 elements");
      for (let e3 = 0; e3 < t2.colorMap.length; e3++) {
        if (4 !== t2.colorMap[e3].length) throw new Error("ColorMap entries must contain 4 values");
      }
      this.colorMap = t2.colorMap;
    } else switch (this.colorMap = t2.colorMap || "roseus", this.colorMap) {
      case "gray":
        this.colorMap = [];
        for (let t3 = 0; t3 < 256; t3++) {
          const e3 = (255 - t3) / 256;
          this.colorMap.push([e3, e3, e3, 1]);
        }
        break;
      case "igray":
        this.colorMap = [];
        for (let t3 = 0; t3 < 256; t3++) {
          const e3 = t3 / 256;
          this.colorMap.push([e3, e3, e3, 1]);
        }
        break;
      case "roseus":
        this.colorMap = [[4528e-6, 4341e-6, 4307e-6, 1], [5625e-6, 6156e-6, 601e-5, 1], [6628e-6, 8293e-6, 8161e-6, 1], [7551e-6, 0.010738, 0.01079, 1], [8382e-6, 0.013482, 0.013941, 1], [9111e-6, 0.01652, 0.017662, 1], [9727e-6, 0.019846, 0.022009, 1], [0.010223, 0.023452, 0.027035, 1], [0.010593, 0.027331, 0.032799, 1], [0.010833, 0.031475, 0.039361, 1], [0.010941, 0.035875, 0.046415, 1], [0.010918, 0.04052, 0.053597, 1], [0.010768, 0.045158, 0.060914, 1], [0.010492, 0.049708, 0.068367, 1], [0.010098, 0.054171, 0.075954, 1], [9594e-6, 0.058549, 0.083672, 1], [8989e-6, 0.06284, 0.091521, 1], [8297e-6, 0.067046, 0.099499, 1], [753e-5, 0.071165, 0.107603, 1], [6704e-6, 0.075196, 0.11583, 1], [5838e-6, 0.07914, 0.124178, 1], [4949e-6, 0.082994, 0.132643, 1], [4062e-6, 0.086758, 0.141223, 1], [3198e-6, 0.09043, 0.149913, 1], [2382e-6, 0.09401, 0.158711, 1], [1643e-6, 0.097494, 0.167612, 1], [1009e-6, 0.100883, 0.176612, 1], [514e-6, 0.104174, 0.185704, 1], [187e-6, 0.107366, 0.194886, 1], [66e-6, 0.110457, 0.204151, 1], [186e-6, 0.113445, 0.213496, 1], [587e-6, 0.116329, 0.222914, 1], [1309e-6, 0.119106, 0.232397, 1], [2394e-6, 0.121776, 0.241942, 1], [3886e-6, 0.124336, 0.251542, 1], [5831e-6, 0.126784, 0.261189, 1], [8276e-6, 0.12912, 0.270876, 1], [0.011268, 0.131342, 0.280598, 1], [0.014859, 0.133447, 0.290345, 1], [0.0191, 0.135435, 0.300111, 1], [0.024043, 0.137305, 0.309888, 1], [0.029742, 0.139054, 0.319669, 1], [0.036252, 0.140683, 0.329441, 1], [0.043507, 0.142189, 0.339203, 1], [0.050922, 0.143571, 0.348942, 1], [0.058432, 0.144831, 0.358649, 1], [0.066041, 0.145965, 0.368319, 1], [0.073744, 0.146974, 0.377938, 1], [0.081541, 0.147858, 0.387501, 1], [0.089431, 0.148616, 0.396998, 1], [0.097411, 0.149248, 0.406419, 1], [0.105479, 0.149754, 0.415755, 1], [0.113634, 0.150134, 0.424998, 1], [0.121873, 0.150389, 0.434139, 1], [0.130192, 0.150521, 0.443167, 1], [0.138591, 0.150528, 0.452075, 1], [0.147065, 0.150413, 0.460852, 1], [0.155614, 0.150175, 0.469493, 1], [0.164232, 0.149818, 0.477985, 1], [0.172917, 0.149343, 0.486322, 1], [0.181666, 0.148751, 0.494494, 1], [0.190476, 0.148046, 0.502493, 1], [0.199344, 0.147229, 0.510313, 1], [0.208267, 0.146302, 0.517944, 1], [0.217242, 0.145267, 0.52538, 1], [0.226264, 0.144131, 0.532613, 1], [0.235331, 0.142894, 0.539635, 1], [0.24444, 0.141559, 0.546442, 1], [0.253587, 0.140131, 0.553026, 1], [0.262769, 0.138615, 0.559381, 1], [0.271981, 0.137016, 0.5655, 1], [0.281222, 0.135335, 0.571381, 1], [0.290487, 0.133581, 0.577017, 1], [0.299774, 0.131757, 0.582404, 1], [0.30908, 0.129867, 0.587538, 1], [0.318399, 0.12792, 0.592415, 1], [0.32773, 0.125921, 0.597032, 1], [0.337069, 0.123877, 0.601385, 1], [0.346413, 0.121793, 0.605474, 1], [0.355758, 0.119678, 0.609295, 1], [0.365102, 0.11754, 0.612846, 1], [0.374443, 0.115386, 0.616127, 1], [0.383774, 0.113226, 0.619138, 1], [0.393096, 0.111066, 0.621876, 1], [0.402404, 0.108918, 0.624343, 1], [0.411694, 0.106794, 0.62654, 1], [0.420967, 0.104698, 0.628466, 1], [0.430217, 0.102645, 0.630123, 1], [0.439442, 0.100647, 0.631513, 1], [0.448637, 0.098717, 0.632638, 1], [0.457805, 0.096861, 0.633499, 1], [0.46694, 0.095095, 0.6341, 1], [0.47604, 0.093433, 0.634443, 1], [0.485102, 0.091885, 0.634532, 1], [0.494125, 0.090466, 0.63437, 1], [0.503104, 0.08919, 0.633962, 1], [0.512041, 0.088067, 0.633311, 1], [0.520931, 0.087108, 0.63242, 1], [0.529773, 0.086329, 0.631297, 1], [0.538564, 0.085738, 0.629944, 1], [0.547302, 0.085346, 0.628367, 1], [0.555986, 0.085162, 0.626572, 1], [0.564615, 0.08519, 0.624563, 1], [0.573187, 0.085439, 0.622345, 1], [0.581698, 0.085913, 0.619926, 1], [0.590149, 0.086615, 0.617311, 1], [0.598538, 0.087543, 0.614503, 1], [0.606862, 0.0887, 0.611511, 1], [0.61512, 0.090084, 0.608343, 1], [0.623312, 0.09169, 0.605001, 1], [0.631438, 0.093511, 0.601489, 1], [0.639492, 0.095546, 0.597821, 1], [0.647476, 0.097787, 0.593999, 1], [0.655389, 0.100226, 0.590028, 1], [0.66323, 0.102856, 0.585914, 1], [0.670995, 0.105669, 0.581667, 1], [0.678686, 0.108658, 0.577291, 1], [0.686302, 0.111813, 0.57279, 1], [0.69384, 0.115129, 0.568175, 1], [0.7013, 0.118597, 0.563449, 1], [0.708682, 0.122209, 0.558616, 1], [0.715984, 0.125959, 0.553687, 1], [0.723206, 0.12984, 0.548666, 1], [0.730346, 0.133846, 0.543558, 1], [0.737406, 0.13797, 0.538366, 1], [0.744382, 0.142209, 0.533101, 1], [0.751274, 0.146556, 0.527767, 1], [0.758082, 0.151008, 0.522369, 1], [0.764805, 0.155559, 0.516912, 1], [0.771443, 0.160206, 0.511402, 1], [0.777995, 0.164946, 0.505845, 1], [0.784459, 0.169774, 0.500246, 1], [0.790836, 0.174689, 0.494607, 1], [0.797125, 0.179688, 0.488935, 1], [0.803325, 0.184767, 0.483238, 1], [0.809435, 0.189925, 0.477518, 1], [0.815455, 0.19516, 0.471781, 1], [0.821384, 0.200471, 0.466028, 1], [0.827222, 0.205854, 0.460267, 1], [0.832968, 0.211308, 0.454505, 1], [0.838621, 0.216834, 0.448738, 1], [0.844181, 0.222428, 0.442979, 1], [0.849647, 0.22809, 0.43723, 1], [0.855019, 0.233819, 0.431491, 1], [0.860295, 0.239613, 0.425771, 1], [0.865475, 0.245471, 0.420074, 1], [0.870558, 0.251393, 0.414403, 1], [0.875545, 0.25738, 0.408759, 1], [0.880433, 0.263427, 0.403152, 1], [0.885223, 0.269535, 0.397585, 1], [0.889913, 0.275705, 0.392058, 1], [0.894503, 0.281934, 0.386578, 1], [0.898993, 0.288222, 0.381152, 1], [0.903381, 0.294569, 0.375781, 1], [0.907667, 0.300974, 0.370469, 1], [0.911849, 0.307435, 0.365223, 1], [0.915928, 0.313953, 0.360048, 1], [0.919902, 0.320527, 0.354948, 1], [0.923771, 0.327155, 0.349928, 1], [0.927533, 0.333838, 0.344994, 1], [0.931188, 0.340576, 0.340149, 1], [0.934736, 0.347366, 0.335403, 1], [0.938175, 0.354207, 0.330762, 1], [0.941504, 0.361101, 0.326229, 1], [0.944723, 0.368045, 0.321814, 1], [0.947831, 0.375039, 0.317523, 1], [0.950826, 0.382083, 0.313364, 1], [0.953709, 0.389175, 0.309345, 1], [0.956478, 0.396314, 0.305477, 1], [0.959133, 0.403499, 0.301766, 1], [0.961671, 0.410731, 0.298221, 1], [0.964093, 0.418008, 0.294853, 1], [0.966399, 0.425327, 0.291676, 1], [0.968586, 0.43269, 0.288696, 1], [0.970654, 0.440095, 0.285926, 1], [0.972603, 0.44754, 0.28338, 1], [0.974431, 0.455025, 0.281067, 1], [0.976139, 0.462547, 0.279003, 1], [0.977725, 0.470107, 0.277198, 1], [0.979188, 0.477703, 0.275666, 1], [0.980529, 0.485332, 0.274422, 1], [0.981747, 0.492995, 0.273476, 1], [0.98284, 0.50069, 0.272842, 1], [0.983808, 0.508415, 0.272532, 1], [0.984653, 0.516168, 0.27256, 1], [0.985373, 0.523948, 0.272937, 1], [0.985966, 0.531754, 0.273673, 1], [0.986436, 0.539582, 0.274779, 1], [0.98678, 0.547434, 0.276264, 1], [0.986998, 0.555305, 0.278135, 1], [0.987091, 0.563195, 0.280401, 1], [0.987061, 0.5711, 0.283066, 1], [0.986907, 0.579019, 0.286137, 1], [0.986629, 0.58695, 0.289615, 1], [0.986229, 0.594891, 0.293503, 1], [0.985709, 0.602839, 0.297802, 1], [0.985069, 0.610792, 0.302512, 1], [0.98431, 0.618748, 0.307632, 1], [0.983435, 0.626704, 0.313159, 1], [0.982445, 0.634657, 0.319089, 1], [0.981341, 0.642606, 0.32542, 1], [0.98013, 0.650546, 0.332144, 1], [0.978812, 0.658475, 0.339257, 1], [0.977392, 0.666391, 0.346753, 1], [0.97587, 0.67429, 0.354625, 1], [0.974252, 0.68217, 0.362865, 1], [0.972545, 0.690026, 0.371466, 1], [0.97075, 0.697856, 0.380419, 1], [0.968873, 0.705658, 0.389718, 1], [0.966921, 0.713426, 0.399353, 1], [0.964901, 0.721157, 0.409313, 1], [0.962815, 0.728851, 0.419594, 1], [0.960677, 0.7365, 0.430181, 1], [0.95849, 0.744103, 0.44107, 1], [0.956263, 0.751656, 0.452248, 1], [0.954009, 0.759153, 0.463702, 1], [0.951732, 0.766595, 0.475429, 1], [0.949445, 0.773974, 0.487414, 1], [0.947158, 0.781289, 0.499647, 1], [0.944885, 0.788535, 0.512116, 1], [0.942634, 0.795709, 0.524811, 1], [0.940423, 0.802807, 0.537717, 1], [0.938261, 0.809825, 0.550825, 1], [0.936163, 0.81676, 0.564121, 1], [0.934146, 0.823608, 0.577591, 1], [0.932224, 0.830366, 0.59122, 1], [0.930412, 0.837031, 0.604997, 1], [0.928727, 0.843599, 0.618904, 1], [0.927187, 0.850066, 0.632926, 1], [0.925809, 0.856432, 0.647047, 1], [0.92461, 0.862691, 0.661249, 1], [0.923607, 0.868843, 0.675517, 1], [0.92282, 0.874884, 0.689832, 1], [0.922265, 0.880812, 0.704174, 1], [0.921962, 0.886626, 0.718523, 1], [0.92193, 0.892323, 0.732859, 1], [0.922183, 0.897903, 0.747163, 1], [0.922741, 0.903364, 0.76141, 1], [0.92362, 0.908706, 0.77558, 1], [0.924837, 0.913928, 0.789648, 1], [0.926405, 0.919031, 0.80359, 1], [0.92834, 0.924015, 0.817381, 1], [0.930655, 0.928881, 0.830995, 1], [0.93336, 0.933631, 0.844405, 1], [0.936466, 0.938267, 0.857583, 1], [0.939982, 0.942791, 0.870499, 1], [0.943914, 0.947207, 0.883122, 1], [0.948267, 0.951519, 0.895421, 1], [0.953044, 0.955732, 0.907359, 1], [0.958246, 0.959852, 0.918901, 1], [0.963869, 0.963887, 0.930004, 1], [0.969909, 0.967845, 0.940623, 1], [0.976355, 0.971737, 0.950704, 1], [0.983195, 0.97558, 0.960181, 1], [0.990402, 0.979395, 0.968966, 1], [0.99793, 0.983217, 0.97692, 1]];
        break;
      default:
        throw Error("No such colormap '" + this.colorMap + "'");
    }
    this.fftSamples = t2.fftSamples || 512, this.height = t2.height || 200, this.noverlap = t2.noverlap || null, this.windowFunc = t2.windowFunc || "hann", this.alpha = t2.alpha, this.frequencyMin = t2.frequencyMin || 0, this.frequencyMax = t2.frequencyMax || 0, this.gainDB = null !== (e2 = t2.gainDB) && void 0 !== e2 ? e2 : 20, this.rangeDB = null !== (s2 = t2.rangeDB) && void 0 !== s2 ? s2 : 80, this.scale = t2.scale || "mel", this.numMelFilters = this.fftSamples / 2, this.numLogFilters = this.fftSamples / 2, this.numBarkFilters = this.fftSamples / 2, this.numErbFilters = this.fftSamples / 2, this.createWrapper(), this.createCanvas();
  }
  onInit() {
    this.container = this.container || this.wavesurfer.getWrapper(), this.container.appendChild(this.wrapper), this.wavesurfer.options.fillParent && Object.assign(this.wrapper.style, { width: "100%", overflowX: "hidden", overflowY: "hidden" }), this.subscriptions.push(this.wavesurfer.on("decode", () => {
      this.buffer = void 0, this.frequencies = void 0;
    }), this.wavesurfer.on("redraw", () => this.render()));
  }
  destroy() {
    this.unAll(), this.wavesurfer.un("ready", this._onReady), this.wavesurfer.un("redraw", this._onRender), this.buffer = void 0, this.frequencies = void 0, this.wavesurfer = null, this.util = null, this.options = null, this.wrapper && (this.wrapper.remove(), this.wrapper = null), super.destroy();
  }
  loadFrequenciesData(e2) {
    return t(this, void 0, void 0, function* () {
      const t2 = yield fetch(e2);
      if (!t2.ok) throw new Error("Unable to fetch frequencies data");
      const s2 = yield t2.json();
      this.frequencies = s2, this.drawSpectrogram(s2);
    });
  }
  createWrapper() {
    this.wrapper = i("div", { style: { display: "block", position: "relative", userSelect: "none" } }), this.options.labels && (this.labelsEl = i("canvas", { part: "spec-labels", style: { position: "absolute", zIndex: 9, width: "55px", height: "100%" } }, this.wrapper)), this.wrapper.addEventListener("click", this._onWrapperClick);
  }
  createCanvas() {
    this.canvas = i("canvas", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 4 } }, this.wrapper), this.spectrCc = this.canvas.getContext("2d");
  }
  render() {
    var t2;
    if (this.frequenciesDataUrl) this.loadFrequenciesData(this.frequenciesDataUrl);
    else {
      const e2 = null === (t2 = this.wavesurfer) || void 0 === t2 ? void 0 : t2.getDecodedData();
      e2 && (this.frequencies && this.buffer === e2 || (this.frequencies = this.getFrequencies(e2)), this.drawSpectrogram(this.frequencies));
    }
  }
  drawSpectrogram(t2) {
    isNaN(t2[0][0]) || (t2 = [t2]), this.wrapper.style.height = this.height * t2.length + "px", this.canvas.width = this.getWidth(), this.canvas.height = this.height * t2.length;
    const e2 = this.spectrCc, s2 = this.height, r2 = this.getWidth(), i2 = this.buffer.sampleRate / 2, a2 = this.frequencyMin, n2 = this.frequencyMax;
    if (e2) {
      if (n2 > i2) {
        const i3 = this.colorMap[this.colorMap.length - 1];
        e2.fillStyle = `rgba(${i3[0]}, ${i3[1]}, ${i3[2]}, ${i3[3]})`, e2.fillRect(0, 0, r2, s2 * t2.length);
      }
      for (let h2 = 0; h2 < t2.length; h2++) {
        const o = this.resample(t2[h2]), l = o[0].length, c = new ImageData(r2, l);
        for (let t3 = 0; t3 < o.length; t3++) for (let e3 = 0; e3 < o[t3].length; e3++) {
          const s3 = this.colorMap[o[t3][e3]], i3 = 4 * ((l - e3 - 1) * r2 + t3);
          c.data[i3] = 255 * s3[0], c.data[i3 + 1] = 255 * s3[1], c.data[i3 + 2] = 255 * s3[2], c.data[i3 + 3] = 255 * s3[3];
        }
        const u = this.hzToScale(a2) / this.hzToScale(i2), f = this.hzToScale(n2) / this.hzToScale(i2), p = Math.min(1, f);
        createImageBitmap(c, 0, Math.round(l * (1 - p)), r2, Math.round(l * (p - u))).then((t3) => {
          e2.drawImage(t3, 0, s2 * (h2 + 1 - p / f), r2, s2 * p / f);
        });
      }
      this.options.labels && this.loadLabels(this.options.labelsBackground, "12px", "12px", "", this.options.labelsColor, this.options.labelsHzColor || this.options.labelsColor, "center", "#specLabels", t2.length), this.emit("ready");
    }
  }
  createFilterBank(t2, e2, s2, r2) {
    const i2 = s2(0), a2 = s2(e2 / 2), n2 = Array.from({ length: t2 }, () => Array(this.fftSamples / 2 + 1).fill(0)), h2 = e2 / this.fftSamples;
    for (let e3 = 0; e3 < t2; e3++) {
      let s3 = r2(i2 + e3 / t2 * (a2 - i2)), o = Math.floor(s3 / h2), l = o * h2, c = (s3 - l) / ((o + 1) * h2 - l);
      n2[e3][o] = 1 - c, n2[e3][o + 1] = c;
    }
    return n2;
  }
  hzToMel(t2) {
    return 2595 * Math.log10(1 + t2 / 700);
  }
  melToHz(t2) {
    return 700 * (Math.pow(10, t2 / 2595) - 1);
  }
  createMelFilterBank(t2, e2) {
    return this.createFilterBank(t2, e2, this.hzToMel, this.melToHz);
  }
  hzToLog(t2) {
    return Math.log10(Math.max(1, t2));
  }
  logToHz(t2) {
    return Math.pow(10, t2);
  }
  createLogFilterBank(t2, e2) {
    return this.createFilterBank(t2, e2, this.hzToLog, this.logToHz);
  }
  hzToBark(t2) {
    let e2 = 26.81 * t2 / (1960 + t2) - 0.53;
    return e2 < 2 && (e2 += 0.15 * (2 - e2)), e2 > 20.1 && (e2 += 0.22 * (e2 - 20.1)), e2;
  }
  barkToHz(t2) {
    return t2 < 2 && (t2 = (t2 - 0.3) / 0.85), t2 > 20.1 && (t2 = (t2 + 4.422) / 1.22), (t2 + 0.53) / (26.28 - t2) * 1960;
  }
  createBarkFilterBank(t2, e2) {
    return this.createFilterBank(t2, e2, this.hzToBark, this.barkToHz);
  }
  hzToErb(t2) {
    return n * Math.log10(1 + 437e-5 * t2);
  }
  erbToHz(t2) {
    return (Math.pow(10, t2 / n) - 1) / 437e-5;
  }
  createErbFilterBank(t2, e2) {
    return this.createFilterBank(t2, e2, this.hzToErb, this.erbToHz);
  }
  hzToScale(t2) {
    switch (this.scale) {
      case "mel":
        return this.hzToMel(t2);
      case "logarithmic":
        return this.hzToLog(t2);
      case "bark":
        return this.hzToBark(t2);
      case "erb":
        return this.hzToErb(t2);
    }
    return t2;
  }
  scaleToHz(t2) {
    switch (this.scale) {
      case "mel":
        return this.melToHz(t2);
      case "logarithmic":
        return this.logToHz(t2);
      case "bark":
        return this.barkToHz(t2);
      case "erb":
        return this.erbToHz(t2);
    }
    return t2;
  }
  applyFilterBank(t2, e2) {
    const s2 = e2.length, r2 = Float32Array.from({ length: s2 }, () => 0);
    for (let i2 = 0; i2 < s2; i2++) for (let s3 = 0; s3 < t2.length; s3++) r2[i2] += t2[s3] * e2[i2][s3];
    return r2;
  }
  getWidth() {
    return this.wavesurfer.getWrapper().offsetWidth;
  }
  getFrequencies(t2) {
    var e2, s2;
    const r2 = this.fftSamples, i2 = (null !== (e2 = this.options.splitChannels) && void 0 !== e2 ? e2 : null === (s2 = this.wavesurfer) || void 0 === s2 ? void 0 : s2.options.splitChannels) ? t2.numberOfChannels : 1;
    if (this.frequencyMax = this.frequencyMax || t2.sampleRate / 2, !t2) return;
    this.buffer = t2;
    const n2 = t2.sampleRate, h2 = [];
    let o = this.noverlap;
    if (!o) {
      const e3 = t2.length / this.canvas.width;
      o = Math.max(0, Math.round(r2 - e3));
    }
    const l = new a(r2, n2, this.windowFunc, this.alpha);
    let c;
    switch (this.scale) {
      case "mel":
        c = this.createFilterBank(this.numMelFilters, n2, this.hzToMel, this.melToHz);
        break;
      case "logarithmic":
        c = this.createFilterBank(this.numLogFilters, n2, this.hzToLog, this.logToHz);
        break;
      case "bark":
        c = this.createFilterBank(this.numBarkFilters, n2, this.hzToBark, this.barkToHz);
        break;
      case "erb":
        c = this.createFilterBank(this.numErbFilters, n2, this.hzToErb, this.erbToHz);
    }
    for (let e3 = 0; e3 < i2; e3++) {
      const s3 = t2.getChannelData(e3), i3 = [];
      let a2 = 0;
      for (; a2 + r2 < s3.length; ) {
        const t3 = s3.slice(a2, a2 + r2), e4 = new Uint8Array(r2 / 2);
        let n3 = l.calculateSpectrum(t3);
        c && (n3 = this.applyFilterBank(n3, c));
        for (let t4 = 0; t4 < r2 / 2; t4++) {
          const s4 = n3[t4] > 1e-12 ? n3[t4] : 1e-12, r3 = 20 * Math.log10(s4);
          r3 < -this.gainDB - this.rangeDB ? e4[t4] = 0 : r3 > -this.gainDB ? e4[t4] = 255 : e4[t4] = (r3 + this.gainDB) / this.rangeDB * 255 + 256;
        }
        i3.push(e4), a2 += r2 - o;
      }
      h2.push(i3);
    }
    return this.frequencies = h2, h2;
  }
  freqType(t2) {
    return t2 >= 1e3 ? (t2 / 1e3).toFixed(1) : Math.round(t2);
  }
  unitType(t2) {
    return t2 >= 1e3 ? "kHz" : "Hz";
  }
  getLabelFrequency(t2, e2) {
    const s2 = this.hzToScale(this.frequencyMin), r2 = this.hzToScale(this.frequencyMax);
    return this.scaleToHz(s2 + t2 / e2 * (r2 - s2));
  }
  loadLabels(t2, e2, s2, r2, i2, a2, n2, h2, o) {
    t2 = t2 || "rgba(68,68,68,0)", e2 = e2 || "12px", s2 = s2 || "12px", r2 = r2 || "Helvetica", i2 = i2 || "#fff", a2 = a2 || "#fff", n2 = n2 || "center";
    const l = this.height || 512, c = l / 256 * 5;
    this.frequencyMin;
    this.frequencyMax;
    const u = this.labelsEl.getContext("2d"), f = window.devicePixelRatio;
    if (this.labelsEl.height = this.height * o * f, this.labelsEl.width = 55 * f, u.scale(f, f), u) for (let h3 = 0; h3 < o; h3++) {
      let o2;
      for (u.fillStyle = t2, u.fillRect(0, h3 * l, 55, (1 + h3) * l), u.fill(), o2 = 0; o2 <= c; o2++) {
        u.textAlign = n2, u.textBaseline = "middle";
        const t3 = this.getLabelFrequency(o2, c), f2 = this.freqType(t3), p = this.unitType(t3), d = 16;
        let w = (1 + h3) * l - o2 / c * l;
        w = Math.min(Math.max(w, h3 * l + 10), (1 + h3) * l - 10), u.fillStyle = a2, u.font = s2 + " " + r2, u.fillText(p, d + 24, w), u.fillStyle = i2, u.font = e2 + " " + r2, u.fillText(f2, d, w);
      }
    }
  }
  resample(t2) {
    const e2 = this.getWidth(), s2 = [], r2 = 1 / t2.length, i2 = 1 / e2;
    let a2;
    for (a2 = 0; a2 < e2; a2++) {
      const e3 = new Array(t2[0].length);
      let n2;
      for (n2 = 0; n2 < t2.length; n2++) {
        const s3 = n2 * r2, h3 = s3 + r2, o2 = a2 * i2, l = o2 + i2, c = Math.max(0, Math.min(h3, l) - Math.max(s3, o2));
        let u;
        if (c > 0) for (u = 0; u < t2[0].length; u++) null == e3[u] && (e3[u] = 0), e3[u] += c / i2 * t2[n2][u];
      }
      const h2 = new Uint8Array(t2[0].length);
      let o;
      for (o = 0; o < t2[0].length; o++) h2[o] = e3[o];
      s2.push(h2);
    }
    return s2;
  }
};
export {
  h as default
};
//# sourceMappingURL=wavesurfer__js_dist_plugins_spectrogram__esm__js.js.map
