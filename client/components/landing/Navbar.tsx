"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setPagesOpen(false);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6">
      <div
        className={`max-w-[1240px] mx-auto rounded-full transition-all duration-300 px-5 sm:px-7 py-3 flex items-center justify-between ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border border-neutral-200/80"
            : "bg-white/80 backdrop-blur-sm border border-neutral-200/60"
        }`}
      >
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="flex items-center gap-2.5 group"
        >
          {/* Green circle icon mark */}
          <div className="w-8 h-8 rounded-full bg-[#055049] flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-bold text-[#101918] tracking-tight">
            TaskManager
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-neutral-600">
          {/* Pages Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPagesOpen(!pagesOpen)}
              onMouseEnter={() => setPagesOpen(true)}
              className="flex items-center gap-1.5 py-1 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <span>Pages</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  pagesOpen
                    ? "rotate-180 text-emerald-800"
                    : "text-neutral-400"
                }`}
              />
            </button>

            {pagesOpen && (
              <div
                onMouseLeave={() => setPagesOpen(false)}
                className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2.5 z-50"
              >
                <button
                  onClick={() => scrollTo("hero")}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>Home</span>
                  <span className="text-[11px] text-neutral-400 font-normal">
                    Intro
                  </span>
                </button>

                <button
                  onClick={() => scrollTo("flow")}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>How It Works</span>
                  <span className="text-[11px] text-neutral-400 font-normal">
                    Flow
                  </span>
                </button>
                <button
                  onClick={() => scrollTo("contact")}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>Contact</span>
                  <span className="text-[11px] text-neutral-400 font-normal">
                    Support
                  </span>
                </button>
              </div>
            )}
          </div>


          <button
            onClick={() => scrollTo("flow")}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="bg-[#0D1514] text-white hover:bg-[#1E2927] text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-black rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-[1240px] mx-auto mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-neutral-200">
          <div className="flex flex-col gap-3 font-medium text-neutral-700">
            <button
              onClick={() => scrollTo("hero")}
              className="text-left py-2 px-3 hover:bg-neutral-100 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-left py-2 px-3 hover:bg-neutral-100 rounded-lg"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("flow")}
              className="text-left py-2 px-3 hover:bg-neutral-100 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-left py-2 px-3 hover:bg-neutral-100 rounded-lg"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
