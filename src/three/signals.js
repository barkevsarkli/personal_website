// Tiny cross-component signal store (no re-renders).
// - inputStarted: Splash flips this when it finishes -> MNIST pixel reveal.
// - nodes: live screen positions (CSS px) of the network's perceptrons,
//   projected each frame so the DOM Pop transitions can spawn from a real node.
export const signals = { inputStarted: false, nodes: [] };
