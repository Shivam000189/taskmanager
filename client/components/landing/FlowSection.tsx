"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FlowSection() {
  const steps = [
    {
      step: "01",
      label: "Create",
      title: "Create & assign tasks in seconds",
      description:
        "Quickly create tasks with titles, descriptions, and due dates. Assign them to team members instantly — everyone stays in the loop with automatic email notifications.",
      checks: [
        "One-click task creation with smart defaults",
        "Auto email notification to assigned team members",
      ],
      image: "/assets/VlksoS1tVElhLr8nie8fMqR2drE.png",
      imageAlt: "Task creation view",
      reverse: false,
    },
    {
      step: "02",
      label: "Track",
      title: "Track progress with real-time status updates",
      description:
        "See every task's status at a glance — from pending to in-progress to complete. Update statuses with a single click, and completion triggers automatic email confirmation to the creator.",
      checks: [
        "Visual status badges for instant clarity",
        "Completion emails sent automatically to task creators",
      ],
      image: "/assets/vkeqfK8AcVG1JlnsPzqxXBpmP7Y.png",
      imageAlt: "Task tracking calendar view",
      reverse: true,
    },
    {
      step: "03",
      label: "Collaborate",
      title: "Collaborate seamlessly across your entire team",
      description:
        "Everyone on the team can view, update, and manage tasks. With Google OAuth authentication and role-based access, collaboration is secure, simple, and friction-free.",
      checks: [
        "Google OAuth sign-in for zero-friction onboarding",
        "Shared task visibility across the entire team",
      ],
      image: "/assets/gzZPVGY3G2GRa4eee8dB8spcYw.png",
      imageAlt: "Team collaboration view",
      reverse: false,
    },
  ];

  return (
    <section id="flow" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-white border border-neutral-200/80 px-3.5 py-1.5 rounded-full shadow-xs mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-800 tracking-wide">
              How It Works
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101918] leading-tight">
            Your Tasks, From Start to Finish
          </h2>
          <p className="mt-4 text-neutral-600 text-base sm:text-lg leading-relaxed">
            A simple three-step workflow that takes your team from scattered
            to-dos to organized, accountable project delivery.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-8 sm:space-y-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-neutral-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Text Column */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center ${
                    step.reverse ? "order-1 lg:order-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#055049]/10 text-[#055049] text-xs font-bold">
                      {step.step}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#101918] leading-snug mb-4">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="space-y-2.5 mb-8 text-sm text-neutral-700 font-medium">
                    {step.checks.map((check, ci) => (
                      <div key={ci} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2.5 bg-[#055049] hover:bg-[#033E38] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95"
                    >
                      <span>Try It Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Image Column */}
                <div
                  className={`lg:col-span-7 ${
                    step.reverse ? "order-2 lg:order-1" : ""
                  }`}
                >
                  <div className="rounded-2xl overflow-hidden border border-neutral-200/90 shadow-lg bg-neutral-50 p-2 sm:p-4">
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="w-full h-auto rounded-xl object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
