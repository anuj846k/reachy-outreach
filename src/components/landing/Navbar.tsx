import Link from "next/link";
import { getUser } from "@/lib/auth-utils";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="fixed top-6 flex w-full items-center justify-center max-w-full z-50 px-4">
      <div className="relative flex w-full max-w-5xl items-center justify-between px-6 py-3 rounded-2xl border border-[#d5e3ff] bg-white backdrop-blur-md shadow-sm transition-all duration-300 md:w-[85%] lg:w-[70%] xl:w-[50%]">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image src="/logos/logo.svg" alt="Reachy Logo" width={40} height={40} className="w-10 h-10" />
          <span className="text-2xl font-bold tracking-tight text-gray-900">Reachy</span>
        </Link>

        <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

        <label
          htmlFor="mobile-menu-toggle"
          className="cursor-pointer md:hidden flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors z-50 peer-checked:hidden"
        >
          <Menu className="w-6 h-6" />
        </label>

        <label
          htmlFor="mobile-menu-toggle"
          className="cursor-pointer md:hidden hidden peer-checked:flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </label>

        <div className="hidden md:flex gap-8">
          <Link href="#product" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Product
          </Link>
          <Link href="#features" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-linear-to-b from-[#1A4FFF] to-[#568CFF] text-white p-2 px-5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-semibold"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="cursor-pointer hover:text-gray-600 transition-colors border border-[#d5e3ff] bg-white p-2 px-5 rounded-xl shadow-xs text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-linear-to-b from-[#1A4FFF] to-[#568CFF] text-white p-2 px-5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-semibold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="absolute top-[calc(100%+0.75rem)] left-0 right-0 hidden peer-checked:flex flex-col gap-5 p-6 rounded-2xl border border-[#d5e3ff] bg-white shadow-xl md:hidden z-40 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <Link href="#product" className="font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg">
              Product
            </Link>
            <Link href="#features" className="font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg">
              Features
            </Link>
            <Link href="#pricing" className="font-medium text-gray-700 hover:text-gray-900 transition-colors text-lg">
              Pricing
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="text-center bg-linear-to-b from-[#1A4FFF] to-[#568CFF] text-white py-3 rounded-xl shadow-md hover:opacity-90 transition-all font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-center cursor-pointer hover:text-gray-600 transition-colors border border-[#d5e3ff] bg-white py-3 rounded-xl shadow-xs font-semibold"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-center bg-linear-to-b from-[#1A4FFF] to-[#568CFF] text-white py-3 rounded-xl shadow-md hover:opacity-90 transition-all font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
