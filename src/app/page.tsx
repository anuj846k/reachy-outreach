import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-utils';
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col font-sans bg-[#f5f5f5]">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
