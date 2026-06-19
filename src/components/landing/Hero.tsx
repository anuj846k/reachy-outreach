import Link from "next/link";
import Image from "next/image";
import { Send, UserPlus, Clock, Sparkles, BarChart3, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center -translate-y-24 sm:-translate-y-20 md:-translate-y-16 lg:-translate-y-12 transition-transform duration-300">
        <div className="relative flex h-[600px] w-[1000px] origin-center scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 2xl:scale-125 transition-transform duration-300">
          <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
            <path
              d="M 500 300 L 400 300 C 300 300, 300 120, 200 120 M 400 300 L 100 300 M 400 300 C 300 300, 300 480, 200 480"
              stroke="#000000" strokeWidth="1.5" strokeOpacity="0.15" fill="none" strokeDasharray="6 6" strokeLinecap="round"
            />
            <path
              d="M 500 300 L 600 300 C 700 300, 700 120, 800 120 M 600 300 L 900 300 M 600 300 C 700 300, 700 480, 800 480"
              stroke="#000000" strokeWidth="1.5" strokeOpacity="0.15" fill="none" strokeDasharray="6 6" strokeLinecap="round"
            />
          </svg>

          <div className="absolute left-[20%] top-[20%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-yellow-200 to-yellow-500 shadow-xs drop-shadow-sm p-3 overflow-hidden">
            <Send className="w-8 h-8 text-white" />
          </div>

          <div className="absolute left-[10%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-green-200 to-green-500 shadow-xs drop-shadow-sm p-3">
            <UserPlus className="w-8 h-8 text-white" />
          </div>

          <div className="absolute left-[20%] top-[80%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-blue-200 to-blue-500 shadow-xs drop-shadow-sm p-3">
            <Clock className="w-8 h-8 text-white" />
          </div>

          <div className="absolute left-[50%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-xl p-4">
            <Image src="/logos/logo.svg" alt="Logo" width={60} height={60} className="rounded-xl object-contain" />
          </div>

          <div className="absolute left-[80%] top-[20%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-purple-200 to-purple-500 shadow-xs drop-shadow-sm p-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div className="absolute left-[90%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-orange-200 to-orange-500 shadow-xs drop-shadow-sm p-3">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>

          <div className="absolute left-[80%] top-[80%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-b from-red-200 to-red-500 shadow-xs drop-shadow-sm p-3">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-10 2xl:bottom-20 flex flex-col items-center justify-center px-4 w-full max-w-4xl z-20">
        <p className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl 2xl:text-6xl font-semibold mb-2 text-center selection:bg-[#1A4FFF] selection:text-white tracking-tight">Personalized outreach, at scale</p>
        <p className="text-sm sm:text-base md:text-md text-gray-700 mb-4 text-center leading-normal max-w-2xl md:max-w-lg">AI-powered outreach that actually gets replies.<br />Manage prospects, generate personalized messages, and track results from one dashboard.</p>
        <Link href="/signup" className="bg-linear-to-b from-[#1A4FFF] to-[#568CFF] text-white p-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all font-semibold">
          Get Started
        </Link>
      </div>
    </section>
  );
}
