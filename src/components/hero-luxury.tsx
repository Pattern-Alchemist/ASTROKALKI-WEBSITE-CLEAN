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
    <section className="relative w-full bg-[#050505] overflow-hidden">
      {/* Grid layout: 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100vh] gap-0">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="relative z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24">
          {/* Premium overline */}
          <div className={`transition-all duration-1000 mb-8 sm:mb-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs sm:text-sm tracking-[0.4em] uppercase font-space-grotesk text-[#c9a96e]/70">
              Pattern Recognition Through Vedic Astrology
            </p>
          </div>

          {/* Main heading - positioned without overlap */}
          <h1 className={`font-cormorant text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-6 sm:mb-8 transition-all duration-1000 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="block text-[#e8e6e1] font-light">Same Pattern,</span>
            <span className="block text-[#c9a96e] font-normal">Different Face.</span>
          </h1>

          {/* Luxury divider */}
          <div className={`flex items-center gap-4 my-6 sm:my-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#c9a96e]/40" />
            <div className="w-2 h-2 bg-[#c9a96e] rounded-full" />
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#c9a96e]/40" />
          </div>

          {/* Elegant subheading */}
          <p className={`text-sm sm:text-base text-[#b0aca5] max-w-md font-light leading-relaxed font-montserrat mb-12 sm:mb-16 transition-all duration-1000 delay-250 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            Not prediction. Pattern recognition.
          </p>

          {/* CTA Buttons - vertical stack on mobile, horizontal on tablet+ */}
          <div className={`flex flex-col sm:flex-row gap-6 sm:gap-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Primary Button - Enhanced Micro-interactions */}
            <Link href="/booking" className="group relative px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-montserrat font-medium text-sm tracking-wide overflow-hidden transition-all duration-500 w-full sm:w-auto active:scale-95">
              {/* Animated gradient border - shifts on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a96e] via-[#e8d5b7] to-[#a8884d] rounded-lg p-px opacity-100 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" />
              <div className="absolute inset-px bg-[#050505] rounded-[6px] transition-all duration-500" />
              
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e8e6e1]/20 to-transparent animate-shimmer" />
              </div>
              
              {/* Content with advanced interactions */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-[#c9a96e] group-hover:text-[#e8e6e1] transition-all duration-400">
                Begin Analysis
                <svg className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>

              {/* Dual glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a96e]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-600 blur-xl scale-75 group-hover:scale-100" />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-700 shadow-xl shadow-[#c9a96e]/30 group-hover:shadow-2xl" />
              
              {/* Scale and lift on hover */}
              <div className="absolute inset-0 rounded-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#c9a96e]/20" />
            </Link>

            {/* Secondary Button - Glass morphism with advanced hover */}
            <Link href="#micro-diagnosis" className="group relative px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-montserrat font-medium text-sm tracking-wide w-full sm:w-auto overflow-hidden transition-all duration-500 active:scale-95">
              {/* Expanding background on hover */}
              <div className="absolute inset-0 bg-[#c9a96e]/5 backdrop-blur-sm rounded-lg border border-[#c9a96e]/30 group-hover:border-[#c9a96e]/70 group-hover:bg-[#c9a96e]/10 transition-all duration-500" />
              
              {/* Radial glow burst effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-radial-gold rounded-lg" />
              </div>
              
              {/* Enhanced shadow and depth */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-60 transition-all duration-600 shadow-lg shadow-[#c9a96e]/30 group-hover:shadow-xl group-hover:shadow-[#c9a96e]/40" />
              
              {/* Content with staggered animation */}
              <span className="relative z-10 flex items-center justify-center gap-2 text-[#c9a96e] group-hover:text-[#e8e6e1] transition-all duration-400">
                <span className="group-hover:translate-y-[-2px] transition-all duration-300">Explore</span>
                <span className="group-hover:translate-y-[-2px] transition-all duration-300" style={{transitionDelay: '50ms'}}>Patterns</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              
              {/* Lift effect */}
              <div className="absolute inset-0 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#c9a96e]/15" />
            </Link>
          </div>

          {/* Trust signals - moved into left column */}
          <div className={`mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#c9a96e]/10 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-xs text-[#7a7a7a] mb-6 font-space-grotesk tracking-wide">TRUSTED BY THOUSANDS</p>
            <div className="flex gap-8 sm:gap-12">
              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">5K+</p>
                <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Pattern Insights</p>
              </div>
              <div className="w-px h-8 bg-[#c9a96e]/20" />
              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">98%</p>
                <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Satisfaction Rate</p>
              </div>
              <div className="w-px h-8 bg-[#c9a96e]/20" />
              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-cormorant text-[#c9a96e]">24/7</p>
                <p className="text-xs text-[#7a7a7a] mt-1 font-montserrat">Community Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Image - hidden on mobile, visible on desktop */}
        <div className="relative z-10 hidden lg:block overflow-hidden">
          {/* Gradient overlay on image side */}
          <div className="absolute inset-0 z-5 bg-gradient-to-l from-transparent via-[#050505]/20 to-[#050505]/60" />
          
          <Image
            src="/hero-luxury-chair.jpg"
            alt="Luxury introspection - Your seat of consciousness"
            fill
            className="object-cover object-center"
            priority
            quality={95}
          />
          
          {/* Decorative glow accent */}
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl opacity-5 animate-pulse" />
        </div>

        {/* Mobile image - shown below text on small screens */}
        <div className="relative z-0 lg:hidden h-64 sm:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
          <Image
            src="/hero-luxury-chair.jpg"
            alt="Luxury introspection - Your seat of consciousness"
            fill
            className="object-cover object-center"
            priority
            quality={85}
          />
        </div>
      </div>

      {/* Scroll indicator - only on desktop */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden lg:flex transition-opacity duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-[#c9a96e]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
