"use client";

import { useI18n } from "@/lib/i18n-context";

const serviceKeys = [
  {
    id: "relationship",
    number: "I",
    titleKey: "services.relationship.title",
    descriptionKey: "services.relationship.description",
    detailKey: "services.relationship.tag1",
    price: "₹1,999",
    duration: "60 min",
    featured: false,
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
  },
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
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

        {/* Service list — editorial, no cards, no 3D objects */}
        <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
          {serviceKeys.map((service) => (
            <div
              key={service.id}
              className="group py-10 sm:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-baseline hover:bg-white/[0.015] transition-colors duration-500 px-2 sm:px-4 -mx-2 sm:-mx-4"
            >
              <div className="md:col-span-1">
                <span className="text-[11px] tracking-[0.3em] text-[#c9a96e]/40 font-mono">
                  {service.number}
                </span>
              </div>
              <div className="md:col-span-6">
                <h3 className="text-[#f0eee9] text-2xl sm:text-3xl font-serif tracking-[-0.01em] mb-4 leading-tight">
                  {t(service.titleKey)}
                </h3>
                <p className="text-[#9a9a9a] text-sm sm:text-base max-w-md leading-[1.8]">
                  {t(service.descriptionKey)}
                </p>
                {service.featured && (
                  <span className="inline-block mt-5 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/80 border border-[#c9a96e]/30 px-3 py-1.5">
                    {t("services.deepestWork")}
                  </span>
                )}
              </div>
              <div className="md:col-span-2">
                <p className="text-[#c9a96e] text-xl sm:text-2xl font-serif">{service.price}</p>
                <p className="text-[#7a7a7a] text-[11px] tracking-[0.2em] uppercase mt-1">
                  {service.duration}
                </p>
              </div>
              <div className="md:col-span-3 flex md:justify-end">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#f0eee9] border-b border-[#c9a96e]/40 pb-2 hover:border-[#c9a96e] transition-colors duration-500"
                >
                  {service.featured ? t("services.beginDeepWork") : t("services.bookSession")}
                  <span className="text-[#c9a96e]">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quick pricing reference — minimal */}
        <div className="mt-20 sm:mt-24 flex flex-wrap items-baseline justify-center gap-8 sm:gap-16">
          {[
            { duration: "30 min", price: "₹1,499" },
            { duration: "60 min", price: "₹1,999" },
            { duration: "90 min", price: "₹2,999" },
          ].map((tier) => (
            <div key={tier.duration} className="flex items-baseline gap-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#7a7a7a]">
                {tier.duration}
              </span>
              <span className="text-[13px] text-[#c9a96e] font-serif">{tier.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
