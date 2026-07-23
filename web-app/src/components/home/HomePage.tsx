'use client'
import Hero from "../global/Hero";
import { Features } from "./Features";
import { Testimonials } from "./Testimonials";
import { HowItWorks } from "./HowItWorks";
import { Footer } from "../global/Footer";
import { CtaBanner } from "./CtaBanner";
import { Navbar } from "../global/Navbar";

// ─── Home page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}