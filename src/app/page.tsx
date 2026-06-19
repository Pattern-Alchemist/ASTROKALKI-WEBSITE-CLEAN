"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import Navigation from "@/components/astrokalki/navigation";
import { HeroLuxury } from "@/components/hero-luxury";
import MicroDiagnosis from "@/components/astrokalki/micro-diagnosis";

// Lazy-loaded below-fold sections for performance
const MicroReading = lazy(() => import("@/components/astrokalki/micro-reading"));
const WhoFindsMe = lazy(() => import("@/components/astrokalki/who-finds-me"));
const Problem = lazy(() => import("@/components/astrokalki/problem"));
const Mirror = lazy(() => import("@/components/astrokalki/mirror"));
const Services = lazy(() => import("@/components/astrokalki/services"));
const MembershipTiers = lazy(() => import("@/components/astrokalki/membership-tiers"));
const Testimonials = lazy(() => import("@/components/astrokalki/testimonials"));
const StatsCounter = lazy(() => import("@/components/astrokalki/stats-counter"));
const Insights = lazy(() => import("@/components/astrokalki/insights"));
const About = lazy(() => import("@/components/astrokalki/about"));
const FAQ = lazy(() => import("@/components/astrokalki/faq"));
const Booking = lazy(() => import("@/components/astrokalki/booking"));
const Newsletter = lazy(() => import("@/components/astrokalki/newsletter"));
const Footer = lazy(() => import("@/components/astrokalki/footer"));
const FloatingActions = lazy(() => import("@/components/astrokalki/floating-actions"));
const ConsentBanner = lazy(() => import("@/components/astrokalki/consent-banner"));

function SectionSkeleton() {
  return <div className="min-h-[200px]" />;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <main id="main-content" className="min-h-screen flex flex-col bg-[#050505]" />
    );
  }

  return (
    <>
      <main id="main-content" className="min-h-screen flex flex-col bg-[#050505]">
        <Navigation />
        <HeroLuxury />
        <MicroDiagnosis />
        <Suspense fallback={<SectionSkeleton />}>
          <MicroReading />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WhoFindsMe />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Problem />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Mirror />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <MembershipTiers />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <StatsCounter />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Insights />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Booking />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Newsletter />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Footer />
        </Suspense>
      </main>

      {/* Minimal floating WhatsApp — only essential */}
      <Suspense fallback={null}>
        <FloatingActions />
      </Suspense>
      <Suspense fallback={null}>
        <ConsentBanner />
      </Suspense>
    </>
  );
}

