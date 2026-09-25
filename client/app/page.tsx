"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FlowSection } from "@/components/landing/FlowSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-[var(--font-inter),sans-serif] overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <FlowSection />
      </main>

      <Footer />
    </div>
  );
}
