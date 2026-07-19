import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import NeuralNetwork from "./NeuralNetwork";
import { scrollProgress } from "./scrollProgress";
import { forwardOf, backpropOf } from "./phases";

const _pos = new THREE.Vector3();
const _tgt = new THREE.Vector3();
const lerp = THREE.MathUtils.lerp;

// Fixed three-quarter view (~30° azimuth, slight elevation) at a constant
// distance — no diving in or zooming back out. We only pan horizontally:
//   forward pass  -> glide the look-at point left -> right with the front
//   backprop pass -> glide it back right -> left with the amber front
const AZ = 0.52; // ~30° around Y
const EL = 0.2; // ~11° above
const RADIUS = 11.5; // constant — no zoom
const COS_EL = Math.cos(EL);

function cameraAt(p) {
  const fwd = forwardOf(p);
  const back = backpropOf(p);

  // Follow the forward front rightward, then ride the backprop front back left.
  let tx = lerp(-5.2, 5.2, fwd);
  tx = lerp(tx, -5.2, back);
  const ty = 0.25;

  _tgt.set(tx, ty, 0);
  _pos.set(
    tx + RADIUS * COS_EL * Math.sin(AZ),
    ty + RADIUS * Math.sin(EL),
    RADIUS * COS_EL * Math.cos(AZ)
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    scrollProgress.value +=
      (scrollProgress.target - scrollProgress.value) * Math.min(1, delta * 6);

    cameraAt(scrollProgress.value);
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.04;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.04;

    camera.position.set(
      _pos.x + mouse.current.x * 0.5,
      _pos.y + mouse.current.y * 0.4,
      _pos.z
    );
    camera.lookAt(_tgt);
  });

  return null;
}

export default function Scene() {
  return (
    <>
      {/* Lines fade into white at depth -> airy, high-key look. */}
      <fog attach="fog" args={["#ffffff", 16, 42]} />
      <NeuralNetwork />
      <CameraRig />
    </>
  );
}
