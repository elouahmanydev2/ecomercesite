import Hero from "../global/Hero";
import { Features } from "./Features";
import { Testimonials } from "./Testimonials";
import { HowItWorks } from "./HowItWorks";
import { Footer } from "../global/Footer";
import { CtaBanner } from "./CtaBanner";
import { Navbar } from "@/components/global/Navbar";
import { getSessionInstance } from "@/lib/auth/getSessionInstance";

// ─── Home page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
    const session = await getSessionInstance();

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
      <Navbar session={session} />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  );
}