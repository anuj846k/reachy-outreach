"use client"

import { useState } from "react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Import Prospects",
      desc: "Add prospects via LinkedIn URL or manually. Reachy automatically extracts their profile and context.",
    },
    {
      title: "AI Outreach Generation",
      desc: "Reachy analyzes each prospect's background and drafts hyper-personalized messages automatically.",
    },
    {
      title: "Automated Classification",
      desc: "Incoming replies are instantly read by AI and tagged as 'Interested', 'Follow-Up', or 'Not Interested'.",
    },
    {
      title: "Close the Deal",
      desc: "Manage conversations, track responses, and move prospects through your pipeline without losing context.",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative bg-gray-50 py-16 sm:py-20 px-6 lg:px-8 overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.15,
          backgroundColor: '#E5E5F7',
          backgroundImage: 'linear-gradient(#444CF7 1px, transparent 1px), linear-gradient(90deg, #444CF7 1px, transparent 1px), linear-gradient(#444CF7 0.5px, transparent 0.5px), linear-gradient(90deg, #444CF7 0.5px, #E5E5F7 0.5px)',
          backgroundSize: '100px 100px, 100px 100px, 10px 10px, 10px 10px',
          backgroundPosition: '-1px -1px, -1px -1px, -0.5px -0.5px, -0.5px -0.5px',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      />

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
            The Outreach Pipeline.
          </h2>
          <p className="mt-2 text-lg font-normal text-gray-600 max-w-3xl mx-auto">
            From first touch to signed deal, managed seamlessly in one place.
          </p>
        </div>

        <div className="relative px-20">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 flex flex-col justify-between bg-white h-full py-8 px-6 rounded-xl min-h-[320px] transition-all duration-300 border ${
                  hoveredIndex === index
                    ? 'bg-linear-to-tl from-[#1A4FFF]/15 to-transparent border-[#1A4FFF]/20 shadow-lg shadow-[#1A4FFF]/10 scale-[1.02]'
                    : 'border-transparent shadow-sm'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === index ? (
                  <>
                    <p className="text-2xl text-[#1A4FFF]/40 text-end">{step.title}</p>
                    <p className="text-lg text-black tracking-tight leading-5 mt-12">{step.desc}</p>
                  </>
                ) : (
                  <>
                    <p className="text-5xl text-gray-300 text-end">0{index + 1}.</p>
                    <p className="text-4xl text-black tracking-tighter leading-tighter mt-12">{step.title}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
