import Nav from "../components/landing/Nav";
import Hero from "../components/landing/Hero";
import TrustStrip from "../components/landing/TrustStrip";
import Problem from "../components/landing/Problem";
import HowItWorks from "../components/landing/HowItWorks";
import ProductShowcase from "../components/landing/ProductShowcase";
import LiveRoom from "../components/landing/LiveRoom";
import Features from "../components/landing/Features";
import PeopleBand from "../components/landing/PeopleBand";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing min-h-screen font-sans">
      <Nav />

      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <HowItWorks />
        <ProductShowcase />
        <LiveRoom />
        <Features />
        <PeopleBand />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
