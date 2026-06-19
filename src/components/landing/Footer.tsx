import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-8 bg-linear-to-b from-[#d5e3ff] to-[#0029B8] text-white w-full rounded-2xl">
      <div className="mx-auto w-[70%]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Image
                src="/logos/logo.svg"
                alt="Logo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="text-3xl font-semibold tracking-tight">Reachy</span>
          </div>

          <div className="flex items-center gap-8 text-[15px] font-medium text-blue-100">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 text-sm font-medium text-blue-200/80">
          <p>
            &copy; {new Date().getFullYear()} Reachy Inc. All rights reserved.
          </p>
          <p>AI-Powered Outreach Platform</p>
        </div>
      </div>
    </footer>
  );
}
