"use client";

import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";
import Image from "next/image";

const serviceKeys = [
  {
    id: "pattern-snapshot",
    titleKey: "services.patternSnapshot.title",
    descriptionKey: "services.patternSnapshot.description",
    price: "₹999",
    duration: "20 min",
    badge: "QUICK START",
    isQuick: true,
    icon: "/images/icon-pattern-snapshot.png",
  },
  {
    id: "relationship",
    number: "I",
    titleKey: "services.relationship.title",
    descriptionKey: "services.relationship.description",
    detailKey: "services.relationship.tag1",
    price: "₹1,999",
    duration: "60 min",
    featured: false,
    isQuick: false,
  },
  {
    id: "emotional",
    number: "II",
    titleKey: "services.emotional.title",
    descriptionKey: "services.emotional.description",
    detailKey: "services.emotional.tag1",
    price: "₹2,999",
    duration: "90 min",
    featured: true,
    isQuick: false,
  },
  {
    id: "shadow",
    number: "III",
    titleKey: "services.shadow.title",
    descriptionKey: "services.shadow.description",
    detailKey: "services.shadow.tag1",
    price: "₹2,999",
    duration: "90 min",
    featured: false,
    isQuick: false,
  },
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-24 sm:mb-32">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
            {t("services.label")}
          </p>
          <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-3xl">
            {t("services.headline1")}{" "}
            <span className="text-[#6a6a6a] italic font-light">{t("services.headline2")}</span>
          </h2>
        </div>

        {/* Quick Start Card - Pattern Snapshot */}
        <div className="mb-16 sm:mb-20">
          <div className="group relative bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-[#c9a96e]/20 rounded-lg p-6 sm:p-8 hover:border-[#c9a96e]/40 transition-all duration-500 card-depth">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/80 border border-[#c9a96e]/40 px-3 py-1.5 mb-4 group-hover:border-[#c9a96e] transition-colors">
                {serviceKeys[0].badge}
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="w-16 h-16 mb-4 relative">
                    <Image
                      src={serviceKeys[0].icon}
                      alt="Pattern Snapshot"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-[#f0eee9] text-xl sm:text-2xl font-serif tracking-[-0.01em] mb-3 leading-tight">
                    {t(serviceKeys[0].titleKey)}
                  </h3>
                  <p className="text-[#9a9a9a] text-sm leading-[1.8] max-w-sm">
                    {t(serviceKeys[0].descriptionKey)}
                  </p>
                </div>
                
                <div className="flex flex-col justify-between sm:items-end">
                  <div>
                    <p className="text-[#c9a96e] text-2xl font-serif">{serviceKeys[0].price}</p>
                    <p className="text-[#7a7a7a] text-[11px] tracking-[0.2em] uppercase mt-1">
                      {serviceKeys[0].duration}
                    </p>
                  </div>
                  
                  <Link
                    href="#booking"
                    className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#f0eee9] border-b border-[#c9a96e]/40 pb-2 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-300 mt-6 sm:mt-0"
                  >
                    {t("services.bookSession")}
                    <span className="text-[#c9a96e] group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Services - Premium Consulting Psychology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {serviceKeys.slice(1).map((service, idx) => (
            <div
              key={service.id}
              className={`group relative rounded-lg overflow-hidden transition-all duration-500 fade-in-section`}
              style={{animationDelay: `${idx * 100}ms`}}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.featured ? 'from-[#c9a96e]/10 to-[#0a0a0a]' : 'from-[#0a0a0a] to-[#050505]'} border ${service.featured ? 'border-[#c9a96e]/30' : 'border-[#c9a96e]/15'} rounded-lg group-hover:border-[#c9a96e]/50 transition-all duration-500`} />
              
              <div className={`relative z-10 p-6 sm:p-8 h-full flex flex-col ${service.featured ? 'bg-gradient-to-br from-[#0a0a0a]/80 to-[#050505]' : 'bg-[#050505]/40'} backdrop-blur-sm`}>
                {/* Number */}
                <span className="text-[11px] tracking-[0.3em] text-[#c9a96e]/40 font-mono mb-4">
                  {service.number}
                </span>

                {/* Title */}
                <h3 className="text-[#f0eee9] text-xl sm:text-2xl font-serif tracking-[-0.01em] mb-4 leading-tight group-hover:text-[#c9a96e] transition-colors">
                  {t(service.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-6 flex-grow">
                  {t(service.descriptionKey)}
                </p>

                {/* Featured Badge */}
                {service.featured && (
                  <span className="inline-block mb-6 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/90 border border-[#c9a96e]/50 px-3 py-1.5 bg-[#c9a96e]/5">
                    {t("services.deepestWork")}
                  </span>
                )}

                {/* Price & Duration */}
                <div className="flex items-baseline justify-between mb-6 pt-4 border-t border-[#c9a96e]/10">
                  <div>
                    <p className="text-[#c9a96e] text-xl font-serif">{service.price}</p>
                    <p className="text-[#7a7a7a] text-[11px] tracking-[0.2em] uppercase mt-1">
                      {service.duration}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="#booking"
                  className={`inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase px-4 py-2 rounded transition-all duration-300 ${
                    service.featured
                      ? 'bg-[#c9a96e] text-[#050505] hover:bg-[#e8d5b7] hover:shadow-lg hover:shadow-[#c9a96e]/30'
                      : 'text-[#f0eee9] border-b border-[#c9a96e]/40 hover:border-[#c9a96e] hover:text-[#c9a96e]'
                  }`}
                >
                  {service.featured ? t("services.beginDeepWork") : t("services.bookSession")}
                  <span className={`${service.featured ? 'group-hover:translate-x-1' : ''} transition-transform`}>→</span>
                </Link>
              </div>

              {/* Glow effect on hover for featured */}
              {service.featured && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-[#c9a96e]/30 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
