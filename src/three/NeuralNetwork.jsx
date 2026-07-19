import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { scrollProgress } from "./scrollProgress";
import { signals } from "./signals";
import { forwardOf, backpropOf } from "./phases";

// ---------------------------------------------------------------------------
// Network reads left -> right along X. The INPUT is an MNIST-style "7", sampled
// into a 28x28 grid of pixel-nodes; those feed the hidden layers. A node's
// normalised X (0 = input, 1 = output) drives the scroll wavefront.
// ---------------------------------------------------------------------------
const X_MIN = -11;
const X_MAX = 8;
const X_RANGE = X_MAX - X_MIN;
const nxOf = (x) => (x - X_MIN) / X_RANGE;
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const LAYERS = [8, 11, 9, 6, 3];
const LAYER_X = [-5, -2, 1, 4, 7];
const SPAN_Y = 9;
const SPAN_Z = 2.4; // flatter than before so the on-neuron numbers stay readable
const EDGE_KEEP = 0.62;

// Tiny deterministic RNG so the activations are stable across reloads.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const GRID = 28;
const INPUT = { cx: -8.5, cy: 0, w: 5, h: 5, z: 0 };

function renderDigit7() {
  const c = document.createElement("canvas");
  c.width = GRID;
  c.height = GRID;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, GRID, GRID);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 1.0;
  ctx.beginPath();
  ctx.moveTo(7, 7);
  ctx.lineTo(21, 7);
  ctx.lineTo(11.5, 23);
  ctx.stroke();
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(10, 15);
  ctx.lineTo(17, 15);
  ctx.stroke();
  return ctx.getImageData(0, 0, GRID, GRID).data;
}

function buildNetwork() {
  const layers = [];
  for (let li = 0; li < LAYERS.length; li++) {
    const count = LAYERS[li];
    const x = LAYER_X[li];
    const nodes = [];
    for (let ni = 0; ni < count; ni++) {
      const t = count === 1 ? 0.5 : ni / (count - 1);
      const y = (t - 0.5) * SPAN_Y * (0.7 + 0.3 * Math.sin(li * 1.7 + ni));
      const z = Math.sin(ni * 2.3 + li * 1.1) * (SPAN_Z * 0.5);
      nodes.push({ x, y, z, nx: nxOf(x) });
    }
    layers.push(nodes);
  }

  // Forward-propagate deterministic activations through the layers. The input
  // layer gets random values in (0,1); every later neuron is a sigmoid of the
  // weighted sum of the previous layer — a real forward pass, so the numbers
  // that light up are internally consistent.
  const rng = mulberry32(20240601);
  layers.forEach((layer, li) => {
    layer.forEach((node) => {
      if (li === 0) {
        node.value = 0.12 + rng() * 0.86;
      } else {
        let sum = -0.3 + (rng() * 2 - 1);
        for (const prev of layers[li - 1]) sum += prev.value * (rng() * 2 - 1) * 0.9;
        node.value = sigmoid(sum);
      }
    });
  });

  const layerNodes = layers.flat();
  const nodePositions = new Float32Array(layerNodes.length * 3);
  const nodeNx = new Float32Array(layerNodes.length);
  layerNodes.forEach((n, i) => {
    nodePositions[i * 3] = n.x;
    nodePositions[i * 3 + 1] = n.y;
    nodePositions[i * 3 + 2] = n.z;
    nodeNx[i] = n.nx;
  });

  const data = renderDigit7();
  const count = GRID * GRID;
  const inputPositions = new Float32Array(count * 3);
  const inputNx = new Float32Array(count);
  const inputIntensity = new Float32Array(count);
  const inputMask = new Float32Array(count);
  const inputReveal = new Float32Array(count); // per-pixel reveal order (0..1)
  const inputGrid = [];
  const strokeIdx = [];
  let k = 0;
  for (let iy = 0; iy < GRID; iy++) {
    for (let ix = 0; ix < GRID; ix++) {
      const x = INPUT.cx + (ix / (GRID - 1) - 0.5) * INPUT.w;
      const y = INPUT.cy + ((GRID - 1 - iy) / (GRID - 1) - 0.5) * INPUT.h;
      const inten = data[(iy * GRID + ix) * 4] / 255;
      inputPositions[k * 3] = x;
      inputPositions[k * 3 + 1] = y;
      inputPositions[k * 3 + 2] = INPUT.z;
      inputNx[k] = nxOf(x);
      inputIntensity[k] = inten;
      inputMask[k] = inten > 0.32 ? 1 : 0;
      // Top-to-bottom scan order, with a touch of jitter, for the pixel intro.
      inputReveal[k] = iy / (GRID - 1) + (Math.random() - 0.5) * 0.04;
      inputGrid.push({ x, y, z: INPUT.z, nx: nxOf(x) });
      if (inputMask[k] === 1) strokeIdx.push(k);
      k++;
    }
  }

  const edgePos = [];
  const edgeNx = [];
  const wanted = 16;
  const step = Math.max(1, Math.floor(strokeIdx.length / wanted));
  for (let i = 0; i < strokeIdx.length; i += step) {
    const s = inputGrid[strokeIdx[i]];
    const target = layers[0][Math.floor(Math.random() * layers[0].length)];
    edgePos.push(s.x, s.y, s.z, target.x, target.y, target.z);
    edgeNx.push(s.nx, target.nx);
  }
  for (let li = 0; li < layers.length - 1; li++) {
    for (const a of layers[li]) {
      for (const b of layers[li + 1]) {
        if (Math.random() > EDGE_KEEP) continue;
        edgePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        edgeNx.push(a.nx, b.nx);
      }
    }
  }

  return {
    nodes: layerNodes, // {x, y, z, nx, value} — used for the on-neuron numbers
    nodePositions,
    nodeNx,
    inputPositions,
    inputNx,
    inputIntensity,
    inputMask,
    inputReveal,
    edgePositions: new Float32Array(edgePos),
    edgeNx: new Float32Array(edgeNx),
  };
}

// ---------- shaders: dark ink on white, vivid blue wavefront ----------
const INK = "vec3(0.05, 0.06, 0.09)";
const ACCENT = "vec3(0.04, 0.04, 0.05)"; // black accent (was blue)

const EDGE_VERTEX = /* glsl */ `
  attribute float aNx;
  varying float vNx;
  void main() {
    vNx = aNx;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const EDGE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uProgress;
  uniform float uBack;
  uniform float uTime;
  varying float vNx;
  void main() {
    float d = vNx - uProgress;
    // Sharp bright leading front (the forward gradient update).
    float front = exp(-(d * d) / (2.0 * 0.0016));
    // Everything the front has passed STAYS activated (the net "lights up").
    float activated = smoothstep(uProgress + 0.015, uProgress - 0.015, vNx);
    // Energy ticks flowing forward along activated edges.
    float flow = smoothstep(0.6, 1.0, sin(vNx * 72.0 - uTime * 5.0) * 0.5 + 0.5) * activated;

    vec3 ink = ${INK};
    vec3 accent = ${ACCENT};
    vec3 bright = vec3(0.5, 0.5, 0.52);
    vec3 col = mix(ink, accent, activated);
    col = mix(col, bright, flow * 0.7);
    col = mix(col, vec3(0.78, 0.8, 0.82), front);
    float a = 0.10 + activated * 0.5 + flow * 0.25 + front * 0.5;

    // --- Backpropagation: an amber band sweeping right -> left ---
    float backPos = 1.0 - uBack;                 // front travels 1 -> 0
    float bd = vNx - backPos;
    float backBand = exp(-(bd * bd) / (2.0 * 0.0022));
    float backActive = smoothstep(0.0, 0.04, uBack) * (1.0 - smoothstep(0.96, 1.0, uBack));
    float backFlow = smoothstep(0.6, 1.0, sin(vNx * 72.0 + uTime * 6.0) * 0.5 + 0.5);
    float backAmt = backBand * backActive;
    vec3 amber = vec3(1.0, 0.52, 0.06);
    col = mix(col, amber, backAmt);
    col = mix(col, vec3(1.0, 0.78, 0.4), backAmt * backFlow * 0.7);
    a = clamp(a + backAmt * 0.65, 0.0, 0.96);

    gl_FragColor = vec4(col, a);
  }
`;

const NODE_VERTEX = /* glsl */ `
  attribute float aNx;
  uniform float uProgress;
  uniform float uBack;
  uniform float uSize;
  varying float vNx;
  void main() {
    vNx = aNx;
    float d = aNx - uProgress;
    float front = exp(-(d * d) / (2.0 * 0.0030));
    float activated = 1.0 - smoothstep(uProgress, uProgress + 0.02, aNx);
    float backPos = 1.0 - uBack;
    float backFront = exp(-pow(aNx - backPos, 2.0) / (2.0 * 0.0035))
      * smoothstep(0.0, 0.04, uBack) * (1.0 - smoothstep(0.96, 1.0, uBack));
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // Keep size near-constant so nodes read as perceptrons, not flaring stars.
    float s = 0.95 + activated * 0.1 + front * 0.2 + backFront * 0.26;
    gl_PointSize = clamp(uSize * s * (150.0 / -mv.z), 4.0, 30.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const NODE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uProgress;
  uniform float uBack;
  varying float vNx;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float disc = smoothstep(0.5, 0.47, r);
    if (disc <= 0.0) discard;
    // A clean perceptron: white interior + a bold black ring (the "window").
    float outline = smoothstep(0.5, 0.45, r) - smoothstep(0.45, 0.36, r);

    float d = vNx - uProgress;
    float front = exp(-(d * d) / (2.0 * 0.0030));
    float activated = 1.0 - smoothstep(uProgress, uProgress + 0.02, vNx);
    float backPos = 1.0 - uBack;
    float backFront = exp(-pow(vNx - backPos, 2.0) / (2.0 * 0.0035))
      * smoothstep(0.0, 0.04, uBack) * (1.0 - smoothstep(0.96, 1.0, uBack));

    // Interior stays light so the activation number printed on the neuron is
    // always legible. Activation is shown by the ring going from ghost-grey to
    // bold ink, plus a brief bright halo as each wavefront passes.
    vec3 interior = mix(vec3(1.0), vec3(0.92, 0.95, 1.0), activated * 0.5);
    vec3 ring = mix(vec3(0.74, 0.76, 0.82), vec3(0.03, 0.03, 0.04), activated);
    vec3 col = mix(interior, ring, outline);
    col = mix(col, vec3(0.18, 0.45, 1.0), front * 0.5 * outline);     // forward pulse (blue)
    col = mix(col, vec3(1.0, 0.52, 0.06), backFront * outline);       // backprop pulse (amber)
    gl_FragColor = vec4(col, disc * (0.45 + 0.55 * activated + 0.4 * front + 0.4 * backFront));
  }
`;

const INPUT_VERTEX = /* glsl */ `
  attribute float aNx;
  attribute float aIntensity;
  attribute float aMask;
  attribute float aReveal;
  uniform float uSize;
  uniform float uReveal;
  varying float vInten;
  varying float vMask;
  varying float vNx;
  varying float vAppear;
  varying float vPop;
  void main() {
    vInten = aIntensity;
    vMask = aMask;
    vNx = aNx;
    // Pixel-input intro: each pixel appears when uReveal passes its scan order.
    vAppear = smoothstep(aReveal, aReveal + 0.1, uReveal);
    vPop = exp(-pow((uReveal - aReveal - 0.04) / 0.05, 2.0)); // brief flash on appear
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float s = (0.5 + 0.5 * vAppear + vPop * 0.9);
    gl_PointSize = clamp(uSize * s * (150.0 / -mv.z), 2.0, 32.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const INPUT_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uProgress;
  varying float vInten;
  varying float vMask;
  varying float vNx;
  varying float vAppear;
  varying float vPop;
  void main() {
    if (vMask < 0.5) discard;
    if (vAppear <= 0.001) discard;
    vec2 q = abs(gl_PointCoord - 0.5);
    float m = max(q.x, q.y);
    float sq = 1.0 - smoothstep(0.40, 0.5, m);
    if (sq <= 0.0) discard;
    float d = vNx - uProgress;
    float front = exp(-(d * d) / (2.0 * 0.004));
    float activated = smoothstep(uProgress + 0.02, uProgress - 0.02, vNx);
    vec3 ink = ${INK};
    vec3 accent = ${ACCENT};
    vec3 col = mix(ink, accent, clamp(activated * 0.85 + front, 0.0, 1.0));
    col = mix(col, accent, clamp(vPop, 0.0, 1.0)); // flash blue as each pixel lands
    gl_FragColor = vec4(col, sq * (0.55 + 0.45 * vInten) * vAppear);
  }
`;

// Activation numbers printed on each hidden/output neuron. As the forward front
// passes a neuron its value counts up from 0 to the propagated activation, so
// you watch the layers "compute" left -> right. Text updates are gated on the
// 2-decimal string actually changing, so Troika only re-syncs when needed.
function NodeNumbers({ nodes }) {
  const refs = useRef([]);

  useFrame(() => {
    const fwd = forwardOf(scrollProgress.value);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const t = refs.current[i];
      if (!t) continue;
      const reveal = smoothstep(n.nx - 0.01, n.nx + 0.06, fwd);
      const vis = reveal > 0.004;
      if (t.visible !== vis) t.visible = vis;
      if (!vis) continue;
      const str = (n.value * reveal).toFixed(2);
      if (t.text !== str) {
        t.text = str;
        t.sync();
      }
    }
  });

  return (
    <group>
      {nodes.map((n, i) => (
        <Text
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[n.x, n.y, n.z + 0.02]}
          fontSize={0.36}
          color="#3f3f46"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ffffff"
          fillOpacity={0.92}
          visible={false}
        >
          0.00
        </Text>
      ))}
    </group>
  );
}

export default function NeuralNetwork() {
  const net = useMemo(buildNetwork, []);

  const reveal = useRef(0);
  const edgeUniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uBack: { value: 0 }, uTime: { value: 0 } }),
    []
  );
  const nodeUniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uBack: { value: 0 }, uSize: { value: 2.8 } }),
    []
  );
  const inputUniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uReveal: { value: 0 }, uSize: { value: 3.4 } }),
    []
  );

  useFrame((state, delta) => {
    const p = scrollProgress.value;
    const fwd = forwardOf(p);
    const back = backpropOf(p);

    // MNIST pixel-input reveal: ramps once the splash hands off.
    if (signals.inputStarted && reveal.current < 1) {
      reveal.current = Math.min(1, reveal.current + delta / 1.3);
    }

    edgeUniforms.uProgress.value = fwd;
    edgeUniforms.uBack.value = back;
    edgeUniforms.uTime.value = state.clock.elapsedTime;
    nodeUniforms.uProgress.value = fwd;
    nodeUniforms.uBack.value = back;
    inputUniforms.uProgress.value = fwd;
    inputUniforms.uReveal.value = reveal.current;
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={net.edgePositions} count={net.edgePositions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-aNx" array={net.edgeNx} count={net.edgeNx.length} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial uniforms={edgeUniforms} vertexShader={EDGE_VERTEX} fragmentShader={EDGE_FRAGMENT} transparent depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={net.nodePositions} count={net.nodePositions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-aNx" array={net.nodeNx} count={net.nodeNx.length} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial uniforms={nodeUniforms} vertexShader={NODE_VERTEX} fragmentShader={NODE_FRAGMENT} transparent depthWrite={false} />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={net.inputPositions} count={net.inputPositions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-aNx" array={net.inputNx} count={net.inputNx.length} itemSize={1} />
          <bufferAttribute attach="attributes-aIntensity" array={net.inputIntensity} count={net.inputIntensity.length} itemSize={1} />
          <bufferAttribute attach="attributes-aMask" array={net.inputMask} count={net.inputMask.length} itemSize={1} />
          <bufferAttribute attach="attributes-aReveal" array={net.inputReveal} count={net.inputReveal.length} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial uniforms={inputUniforms} vertexShader={INPUT_VERTEX} fragmentShader={INPUT_FRAGMENT} transparent depthWrite={false} />
      </points>

      <NodeNumbers nodes={net.nodes} />
    </group>
  );
}
