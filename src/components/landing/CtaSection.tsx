import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="bg-linear-to-b from-white via-0% to-[#d5e3ff] pt-20 px-6 lg:px-8 w-full">
      <div className="relative overflow-hidden w-[70%] mx-auto rounded-[2.5rem] bg-[#4A6FFF] px-6 py-10 shadow-2xl md:px-16 lg:px-24">
        <div className="absolute -left-32 h-96 w-96 rounded-full bg-[#5A7FFF] opacity-50 blur-2xl"></div>
        <div className="absolute -right-32 h-96 w-96 rounded-full bg-[#5A7FFF] opacity-50 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3A5FFF] opacity-30 blur-3xl"></div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3A5FFF] rounded-bl-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3A5FFF] rounded-tr-[100px] opacity-40"></div>

        <div className="relative mx-auto max-w-4xl text-center flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
            <Image
              src="/logos/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-medium tracking-tight text-white flex flex-col items-center leading-tight">
            <span>Ready to Transform</span>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <span>Your Outreach?</span>
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-lg font-medium text-gray-900 transition-all hover:scale-105 hover:bg-gray-50 shadow-sm"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
              </Link>
            </div>
          </h2>
        </div>
      </div>
    </section>
  );
}
