'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function HeroLuxury() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background image with luxury overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-luxury-chair.jpg"
          alt="Luxury introspection - Your seat of consciousness"
          fill
          className="object-cover opacity-40"
          priority
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-70" />
        {/* Neon glow accent */}
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl opacity-5 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center">
        {/* Luxury header text */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Premium overline */}
          <p className="text-xs sm:text-sm tracking-[0.4em] uppercase font-space-grotesk text-[#c9a96e]/70 mb-6 sm:mb-8">
            Pattern Recognition Through Vedic Astrology
          </p>

          {/* Main heading - modern script luxury */}
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 sm:mb-8">
            <span className="block text-[#e8e6e1] font-light">The Same Pain.</span>
            <span className="block text-[#c9a96e] font-normal">Different Face.</span>
            <span className="block text-[#e8e6e1] font-light">Same Pattern.</span>
          </h1>

          {/* Luxury divider */}
          <div className="flex items-center justify-center gap-4 my-8 sm:my-10">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#c9a96e]/50" />
            <div className="w-2 h-2 bg-[#c9a96e] rounded-full" />
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#c9a96e]/50" />
          </div>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#9a9a9a] max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-12 font-montserrat">
            Relationships. Self-sabotage. Emotional confusion. Sometimes the problem isn&apos;t your choices — it&apos;s the pattern beneath them. 
            <span className="block text-[#c9a96e] font-medium mt-3">Not prediction. Pattern recognition.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Primary Button */}
          <Link href="/booking" className="glass-button group relative">
            <span className="relative z-10 flex items-center justify-center gap-2 font-montserrat font-semibold">
              Begin Your Pattern Analysis
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* Secondary Button */}
          <Link href="#explore" className="group border border-[#c9a96e]/30 hover:border-[#c9a96e]/60 rounded-lg px-8 py-3 sm:py-4 text-[#c9a96e] font-montserrat font-semibold text-sm tracking-wide transition-all duration-500 backdrop-blur-sm hover:bg-[#c9a96e]/5">
            <span className="flex items-center justify-center gap-2">
              Explore Patterns
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Trust signals */}
        <div className={`mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#c9a96e]/10 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-[#7a7a7a] mb-6 font-space-grotesk tracking-wide">TRUSTED BY THOUSANDS</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 items-center">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">5K+</p>
              <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Pattern Insights</p>
            </div>
            <div className="w-px h-8 bg-[#c9a96e]/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">98%</p>
              <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Satisfaction Rate</p>
            </div>
            <div className="w-px h-8 bg-[#c9a96e]/20" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">24/7</p>
              <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Community Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-[#c9a96e]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
