import AircraftFea from "./AircraftFea";
import BarkevGpt from "./BarkevGpt";
import BloodDonor from "./BloodDonor";
import ImageDecoder from "./ImageDecoder";
import LibraryTracker from "./LibraryTracker";
import MechBird from "./MechBird";
import NeuralNet from "./NeuralNet";
import Vpn from "./Vpn";
import WhatsappLlm from "./WhatsappLlm";

// Stable key (each project's `visual` field) -> animation component.
export const PROJECT_ANIMS = {
  barkevgpt: BarkevGpt,
  vpn: Vpn,
  "whatsapp-llm": WhatsappLlm,
  "library-tracker": LibraryTracker,
  "neural-net": NeuralNet,
  "image-decoder": ImageDecoder,
  "mech-bird": MechBird,
  "aircraft-fea": AircraftFea,
  "blood-donor": BloodDonor,
};

export { default as useCardMotion } from "./useCardMotion";
