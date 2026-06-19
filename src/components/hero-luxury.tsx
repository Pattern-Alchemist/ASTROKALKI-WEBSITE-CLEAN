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
          className="object-cover opacity-70"
          priority
          quality={95}
        />
        {/* Gradient overlay - strategic to frame content while showing image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/30 to-[#050505]/90" />
        {/* Neon glow accent */}
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl opacity-5 animate-pulse" />
      </div>

      {/* Content - restructured for image prominence */}
      <div className="relative z-10 w-full px-6 sm:px-10 flex flex-col items-center">
        {/* Top section: Navigation text only */}
        <div className={`transition-all duration-1000 mb-24 sm:mb-32 lg:mb-40 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Premium overline */}
          <p className="text-xs sm:text-sm tracking-[0.4em] uppercase font-space-grotesk text-[#c9a96e]/70">
            Pattern Recognition Through Vedic Astrology
          </p>
        </div>

        {/* Middle section: Large gap for image visibility */}
        <div className="h-32 sm:h-48 lg:h-64 w-full" />

        {/* Bottom section: Heading and buttons */}
        <div className="flex flex-col items-center">
          {/* Main heading - simplified, impactful */}
          <h1 className={`font-cormorant text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.15] mb-4 sm:mb-6 text-center max-w-4xl transition-all duration-1000 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="block text-[#e8e6e1] font-light">Same Pattern,</span>
            <span className="block text-[#c9a96e] font-normal">Different Face.</span>
          </h1>

          {/* Luxury divider */}
          <div className={`flex items-center justify-center gap-4 my-5 sm:my-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#c9a96e]/40" />
            <div className="w-2 h-2 bg-[#c9a96e] rounded-full" />
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#c9a96e]/40" />
          </div>

          {/* Elegant subheading - positioned above buttons */}
          <p className={`text-sm sm:text-base text-[#b0aca5] max-w-xl mx-auto font-light leading-relaxed font-montserrat mb-10 sm:mb-12 transition-all duration-1000 delay-250 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            Not prediction. Pattern recognition.
          </p>

          {/* CTA Buttons - maximum gap to frame image */}
          <div className={`flex flex-col sm:flex-row gap-8 sm:gap-32 lg:gap-48 justify-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Primary Button - Modern gradient border */}
          <Link href="/booking" className="group relative px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-montserrat font-medium text-sm tracking-wide overflow-hidden transition-all duration-500">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#c9a96e] to-[#a8884d] rounded-lg p-px" />
            <div className="absolute inset-px bg-[#050505] rounded-[6px]" />
            
            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2 text-[#c9a96e] group-hover:text-[#e8e6e1] transition-colors duration-300">
              Begin Analysis
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>

            {/* Glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#c9a96e]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </Link>

          {/* Secondary Button - Glass style with border glow */}
          <Link href="#explore" className="group relative px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-montserrat font-medium text-sm tracking-wide">
            <div className="absolute inset-0 bg-[#c9a96e]/5 backdrop-blur-sm rounded-lg border border-[#c9a96e]/30 group-hover:border-[#c9a96e]/60 transition-all duration-500" />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-[#c9a96e]/20" />
            
            <span className="relative z-10 flex items-center justify-center gap-2 text-[#c9a96e] group-hover:text-[#e8e6e1] transition-colors duration-300">
              Explore Patterns
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Trust signals - positioned lower */}
        <div className={`mt-16 sm:mt-20 lg:mt-24 pt-8 sm:pt-12 border-t border-[#c9a96e]/10 w-full max-w-5xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-[#7a7a7a] mb-6 font-space-grotesk tracking-wide text-center">TRUSTED BY THOUSANDS</p>
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
