# Barkev Şarklı — Portfolio

A dark-themed, interactive personal portfolio for an engineer working across
low-level systems, deep learning, and mechatronics.

## The signature feature

The background is a **3D neural network** rendered with Three.js
(react-three-fiber). As you scroll, a glowing **activation wavefront propagates
through the edges from left to right** — and reverses when you scroll back up.
It is strictly tied to scroll position via **GSAP ScrollTrigger** (`scrub: true`),
so the "gradient update" moves frame-for-frame with the scrollbar.

### How it works

- `src/three/NeuralNetwork.jsx` — builds the layered graph (nodes laid out
  left→right along X) and renders edges (`LineSegments`) + nodes (`Points`) with
  custom GLSL shaders. Each vertex carries a normalised X (`aNx`, 0→1).
- The shaders compare `aNx` to a `uProgress` uniform. A Gaussian band centered on
  `uProgress` is the bright wavefront; everything behind it keeps a trailing glow.
- `src/App.jsx` creates a page-length `ScrollTrigger` and writes its progress into
  a tiny shared store (`src/three/scrollProgress.js`).
- The render loop (`useFrame`) eases the shader's `uProgress` toward that value, so
  the sweep stays smooth even on fast scroll jumps.

## Tech

React · Vite · Tailwind CSS · Three.js / @react-three/fiber + drei · GSAP (ScrollTrigger)

## Scripts

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  components/   ThreeScene, Navbar, SectionHeading, Pop, ProjectVisual, Icons
  sections/     Hero, About, Education, Certificates, Arsenal, Experience,
                Publications, Projects, Leadership, Hobbies (Off-Screen), Footer (Contact)
  three/        NeuralNetwork (shaders), scrollProgress store
  hooks/        useReveal (scroll-in animations)
  i18n/         translations.js  <-- all copy, in EN / TR / DE
  data/         content.js       <-- profile links, certificates, grouped tech stack
```

Section order is set in `src/App.jsx`. Each project in `translations.js` names
its motif with a `visual` key (see `ProjectVisual.jsx`), so reordering projects
never mixes up their visuals.
