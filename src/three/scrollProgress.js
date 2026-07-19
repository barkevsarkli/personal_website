// A tiny shared store so GSAP ScrollTrigger (DOM world) and the
// react-three-fiber render loop (WebGL world) can talk without re-renders.
// GSAP writes `target` on every scroll tick; useFrame eases `value` toward it
// so the wavefront feels smooth even with fast scroll jumps.
export const scrollProgress = {
  value: 0, // eased value actually fed to the shader (0..1)
  target: 0, // raw scroll progress written by ScrollTrigger (0..1)
};
