import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "../three/Scene";

// Fixed, full-viewport WebGL layer that lives behind every section.
export default function ThreeScene() {
  return (
    <div className="three-canvas-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Soft white wash keeps text legible over the line work. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.35)_0%,_transparent_38%,_rgba(255,255,255,0.55)_100%)]" />
    </div>
  );
}
