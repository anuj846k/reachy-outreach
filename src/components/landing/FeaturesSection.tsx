"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(0);

  const features = [
    {
      title: "AI-Powered Personalization",
      desc: "Each message is uniquely tailored to the prospect's background, industry, and pain points using advanced AI analysis.",
    },
    {
      title: "Real-Time Sync",
      desc: "Keep all your outreach data synced instantly across your team without hitting refresh.",
    },
    {
      title: "Advanced Analytics",
      desc: "Track reply rates, conversion metrics, and pipeline performance with beautiful, actionable dashboards.",
    },
  ];

  return (
    <section id="features" className="bg-[#EAEAEA] py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl bg-white rounded-4xl p-10 border border-white/20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[3.5rem] leading-none font-bold tracking-tighter text-black">5X</span>
                  <div className="flex text-[#568CFF]">
                    <svg className="w-8 h-8 opacity-100 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    <svg className="w-8 h-8 opacity-50 -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    <svg className="w-8 h-8 opacity-20 -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-snug pr-4">
                  Boost your reply rates with AI-personalized outreach.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="bg-white rounded-xl py-2 px-4 flex flex-col justify-center bg-linear-to-b from-transparent to-[#1A4FFF]/15 drop-shadow-xs">
                  <p className="text-gray-800 text-xs">Smart Sequences</p>
                </div>
                <div className="bg-white rounded-xl py-2 px-4 bg-linear-to-b from-transparent to-[#1A4FFF]/15 drop-shadow-xs flex flex-col justify-center">
                  <p className="text-gray-800 text-xs">Pipeline Tracking</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl h-[260px] overflow-hidden flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="p-8 w-full">
                <div className="flex items-end gap-3 h-full">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#3461FF] to-[#568CFF] transition-all duration-500"
                        style={{ height: `${h * 1.8}px` }}
                      />
                      <div className="text-[8px] text-gray-400 font-medium">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-2.5 py-1 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-600 font-medium">+24% this week</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:pl-6 h-full justify-between">
            <div className="w-full">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-10 leading-[1.1]">
                Smart Features That<br />Make a Difference
              </h2>

              <div className="w-full space-y-5 min-h-[260px]">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`border-b ${activeFeature === index ? 'border-gray-200 pb-5' : 'border-gray-200 pb-5'} cursor-pointer`}
                    onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-md transition-colors ${activeFeature === index ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                          {feature.title}
                        </h3>
                      </div>
                      {activeFeature === index ? (
                        <svg className="w-4 h-4 text-[#568CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      )}
                    </div>

                    <div className={`grid transition-all duration-300 ease-in-out ${activeFeature === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-gray-500 text-[14px] leading-relaxed pr-8 pt-2">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              className="group relative inline-block cursor-pointer overflow-hidden transition-all duration-300 border border-[#d5e3ff] hover:border-transparent p-2 px-5 rounded-xl shadow-xs text-sm bg-white"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-[#1A4FFF] to-[#568CFF] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
              <span className="relative z-10 text-black transition-colors duration-300 ease-in-out group-hover:text-white font-medium">
                Start for Free
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
