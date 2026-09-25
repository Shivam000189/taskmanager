"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      id="contact"
      className="relative pt-20 pb-12 overflow-hidden bg-white border-t border-neutral-200/80"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-neutral-200/80">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <a href="#" className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#055049] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-lg font-bold text-[#101918] tracking-tight">
                  TaskManager
                </span>
              </a>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-sm">
                TaskManager is the all-in-one task and project management
                platform that helps you stay organized, collaborate seamlessly,
                and keep work moving forward — all in one place.
              </p>
            </div>

            <div className="mt-8 text-xs text-neutral-400">
              Built with precision for modern builders and high-performing
              teams.
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-[#101918] uppercase tracking-wider mb-4">
                Pages
              </h4>
              <ul className="space-y-3 text-sm text-neutral-600 font-medium">
                <li>
                  <button
                    onClick={() => scrollTo("hero")}
                    className="hover:text-emerald-800 transition-colors"
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => scrollTo("flow")}
                    className="hover:text-emerald-800 transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="hover:text-emerald-800 transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#101918] uppercase tracking-wider mb-4">
                Company & Legal
              </h4>
              <ul className="space-y-3 text-sm text-neutral-600 font-medium">
                <li>
                  <button className="hover:text-emerald-800 transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-800 transition-colors">
                    Changelog
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-800 transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-emerald-800 transition-colors">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#F8F9FA] rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
            <h4 className="text-lg font-bold text-[#101918] mb-2">
              Stay in the Loop with TaskManager
            </h4>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Get the latest updates, productivity tips, and insights — straight
              to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-2xl text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>You&apos;re on the list! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white px-4 py-3 rounded-full text-sm text-neutral-800 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#055049] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#055049] hover:bg-[#033E38] text-white text-sm font-semibold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="relative pt-12 pb-8 flex justify-center pointer-events-none select-none overflow-hidden">
          <div
            className="text-[100px] sm:text-[160px] lg:text-[200px] font-extrabold tracking-tight leading-none text-neutral-200/60"
            style={{
              filter: "blur(3px)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            }}
          >
            TaskManager
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>Copyright © 2025 TaskManager. All Rights Reserved</p>
          <div className="flex items-center gap-6">
            <span>Built with Next.js & Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <span>High Performance Task Management</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
