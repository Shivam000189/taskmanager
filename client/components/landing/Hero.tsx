"use client";

import { Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
      {/* Background lined paper subtle pattern like in task-manger-landing */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url('/assets/FaGBRvf1oWLONyYhDxPNrADSV0o.png')`,
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat-y',
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Center Rating Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-neutral-200/80 px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            {/* Paperclip attached over the badge */}
            <div className="absolute -top-3.5 right-1/3 transform translate-x-3 pointer-events-none z-30">
              <img
                src="/assets/PBpuxqRpmPqftU0hol2DVhW7bus.png"
                alt="Paperclip"
                className="w-5 h-auto drop-shadow-md"
              />
            </div>

            {/* Overlapping User Avatars */}
            <div className="flex -space-x-2 overflow-hidden items-center">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src="/assets/HH8KrojyxZx6X20z1r13CSwiiWE.jpg"
                alt="User avatar 1"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src="/assets/lNVgmspuO6M42v7anZdORIPyy4.jpg"
                alt="User avatar 2"
              />
              <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-[#055049] items-center justify-center">
                <span className="text-white text-[10px] font-bold">+5k</span>
              </div>
            </div>

            {/* Stars & Rating */}
            <div className="flex items-center gap-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800 ml-1">
                4.90/5
              </span>
            </div>

            <span className="text-neutral-300">|</span>

            {/* Trusted text */}
            <span className="text-xs font-semibold text-neutral-700">
              Trusted by{" "}
              <span className="text-neutral-900 font-bold">48,890+</span> users
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#101918] leading-[1.08]">
            Turn ideas into action with a smarter way to manage tasks.
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Organize your day with TaskManager, stay ahead of deadlines, and
            focus on what truly matters — with smart task management that keeps
            your team aligned.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-[#055049] hover:bg-[#033E38] text-white px-7 py-3.5 rounded-full font-semibold text-[15px] flex items-center gap-2 shadow-[0_8px_20px_rgba(5,80,73,0.25)] hover:shadow-[0_12px_24px_rgba(5,80,73,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started Free</span>
              <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("flow");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#101918] hover:bg-[#202E2C] text-white px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
            >
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

