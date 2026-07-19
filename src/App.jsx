import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ThreeScene from "./components/ThreeScene";
import Splash from "./components/Splash";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Education from "./sections/Education";
import Certificates from "./sections/Certificates";
import Arsenal from "./sections/Arsenal";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Hobbies from "./sections/Hobbies";
import Footer from "./sections/Footer";
import { useReveal } from "./hooks/useReveal";
import { scrollProgress } from "./three/scrollProgress";
import { initSmoothScroll } from "./lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const main = useRef(null);
  const progressBar = useRef(null);
  useReveal(main);

  // Buttery, interpolated scrolling (Lenis) driving GSAP from one RAF loop.
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup ?? undefined;
  }, []);

  // THE core link: tie the neural-network wavefront to scroll position.
  // `scrub: true` means scrolling down pushes the activation forward through
  // the edges, and scrolling up reverses it — frame-for-frame with the scroll.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.target = self.progress;
        if (progressBar.current) {
          progressBar.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      {/* Loading splash (self-unmounts after its intro) */}
      <Splash />

      {/* Fixed 3D neural-network background */}
      <ThreeScene />

      {/* Scroll progress bar (mirrors the wavefront position) */}
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div
          ref={progressBar}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-neural-cyan via-neural-blue to-neural-violet"
        />
      </div>

      <Navbar />

      {/* Foreground content sits above the canvas */}
      <main ref={main} className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Certificates />
        <Arsenal />
        <Experience />
        <Projects />
        <Hobbies />
        <Footer />
      </main>
    </>
  );
}
