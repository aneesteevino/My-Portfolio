import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";
import { ACHIEVEMENTS, COPY } from "@/lib/data";
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        {COPY.ui.skip}
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        {ACHIEVEMENTS.length > 0 && <Achievements />}
        <Contact />
      </main>
      <SmoothScroll />
      <RevealObserver />
    </>
  );
}
