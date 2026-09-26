// Story animation per project (10–15s GSAP loops, see ./visuals/Scene.jsx).
import AgentScene from "./visuals/AgentScene";
import TunnelScene from "./visuals/TunnelScene";
import BridgeScene from "./visuals/BridgeScene";
import DetectScene from "./visuals/DetectScene";
import NetScene from "./visuals/NetScene";
import PixelScene from "./visuals/PixelScene";
import GearScene from "./visuals/GearScene";
import PlaneScene from "./visuals/PlaneScene";
import DatabaseScene from "./visuals/DatabaseScene";

// Looked up by each project's `visual` key (not its position in the list), so
// reordering projects never swaps their scenes. Each project's `steps` (in
// translations.js) are the captions for its scene, in order.
const VISUALS = {
  chat: AgentScene,
  tunnel: TunnelScene,
  bridge: BridgeScene,
  detect: DetectScene,
  net: NetScene,
  pixels: PixelScene,
  gears: GearScene,
  plane: PlaneScene,
  database: DatabaseScene,
};

export default function ProjectVisual({ name, steps }) {
  const V = VISUALS[name] ?? AgentScene;
  return <V steps={steps} />;
}
