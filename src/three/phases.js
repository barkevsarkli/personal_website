// Scroll-driven narrative, shared between the network shaders and the camera
// rig so they stay in lockstep.
//
// Design: the camera holds a fixed ~30° three-quarter angle and pans
// horizontally (no zoom-in/zoom-out). Two passes play out as you scroll:
//   forward pass  (left -> right) : neurons light up + their activation numbers
//                                   count up from 0 -> value over [0, FWD_END]
//   backprop pass (right -> left) : amber gradient front sweeps back over
//                                   [BACK_START, BACK_END]
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Forward fills the first half of the scroll; backprop sweeps the second half.
export const FWD_END = 0.5;
export const BACK_START = 0.56;
export const BACK_END = 0.96;

export const forwardOf = (p) => ss(0, 1, clamp01(p / FWD_END));
export const backpropOf = (p) =>
  ss(0, 1, clamp01((p - BACK_START) / (BACK_END - BACK_START)));

// Network X-extent (input at X_MIN, output at X_MIN + X_RANGE).
export const X_MIN = -11;
export const X_RANGE = 19;
