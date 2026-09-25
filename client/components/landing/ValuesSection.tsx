"use client";

import { Sparkles } from "lucide-react";

export function ValuesSection() {
  const cards = [
    {
      title: "Clarity Creates Focus",
      description:
        "Purposeful thinking overpowers scattered effort. Every feature we build is made to simplify your workday and keep you focused on what matters.",
      image: "/assets/TnplamgRY2ukmt782azuiyKM8Vw.png",
      alt: "Clarity Creates Focus - 3D Magnifying Glass",
    },
    {
      title: "Momentum Drives Growth",
      description:
        "Real speed comes from clarity and flow, helping you ship what matters most — fast and without chaos.",
      image: "/assets/e4YhOBRLMApy4qwgKe4RHRIHk0.png",
      alt: "Momentum Drives Growth - 3D Growth Steps",
    },
    {
      title: "Trust at the Core",
      description:
        "Our focus is on real teams, not just users. We never compromise on transparency, integrity, or reliability.",
      image: "/assets/mLxRMBkrwwHGCftOANUhjYQUKs.png",
      alt: "Trust at the Core - 3D Handshake Shield",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-white border border-neutral-200/80 px-3.5 py-1.5 rounded-full shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span className="text-xs font-semibold text-neutral-800 tracking-wide">
              Our Key Values
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101918] leading-tight">
            The Foundation of Our Approach
          </h2>
          <p className="mt-4 text-neutral-600 text-base sm:text-lg leading-relaxed">
            We build on principles of clarity, collaboration, and trust —
            forming the foundation of how TaskManager works and delivers
            results.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Paper clip on top-left */}
              <div className="absolute -top-3.5 left-8 pointer-events-none z-10">
                <img
                  src="/assets/PBpuxqRpmPqftU0hol2DVhW7bus.png"
                  alt="Paper clip"
                  className="w-5 h-auto drop-shadow-sm transform -rotate-12"
                />
              </div>

              {/* Text Area */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#101918] mb-3">
                  {card.title}
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* 3D Render Illustration */}
              <div className="mt-8 flex justify-center items-center py-4">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="h-36 sm:h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
