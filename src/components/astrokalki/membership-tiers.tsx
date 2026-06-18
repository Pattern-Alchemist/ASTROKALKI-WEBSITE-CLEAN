"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";

const tierKeys = [
  {
    id: "single",
    number: "I",
    titleKey: "membership.single.title",
    descriptionKey: "membership.single.description",
    featureKeys: [
      "membership.single.feature1",
      "membership.single.feature2",
      "membership.single.feature3",
      "membership.single.feature4",
    ],
    ctaKey: "membership.single.cta",
    price: "₹1,999",
    period: "one-time",
    membershipType: "single",
    popular: false,
  },
  {
    id: "monthly",
    number: "II",
    titleKey: "membership.monthly.title",
    descriptionKey: "membership.monthly.description",
    featureKeys: [
      "membership.monthly.feature1",
      "membership.monthly.feature2",
      "membership.monthly.feature3",
      "membership.monthly.feature4",
      "membership.monthly.feature5",
    ],
    ctaKey: "membership.monthly.cta",
    price: "₹999",
    period: "/month",
    membershipType: "monthly",
    popular: true,
  },
  {
    id: "annual",
    number: "III",
    titleKey: "membership.annual.title",
    descriptionKey: "membership.annual.description",
    featureKeys: [
      "membership.annual.feature1",
      "membership.annual.feature2",
      "membership.annual.feature3",
      "membership.annual.feature4",
      "membership.annual.feature5",
      "membership.annual.feature6",
    ],
    ctaKey: "membership.annual.cta",
    price: "₹9,999",
    period: "/year",
    membershipType: "annual",
    popular: false,
  },
];

export default function MembershipTiers() {
  const { t } = useI18n();

  return (
    <section id="membership" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-20 sm:mb-28">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
            {t("membership.label")}
          </p>
          <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-3xl">
            {t("membership.headline1")}{" "}
            <span className="text-[#6a6a6a] italic font-light">{t("membership.headline2")}</span>
          </h2>
        </div>

        {/* Tier rows — editorial table, no cards, no 3D */}
        <div className="border-t border-white/[0.06]">
          {tierKeys.map((tier) => (
            <div
              key={tier.id}
              className="border-b border-white/[0.06] py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10"
            >
              {/* Number + title + price */}
              <div className="md:col-span-5">
                <span className="text-[11px] tracking-[0.3em] text-[#c9a96e]/40 font-mono block mb-4">
                  {tier.number}
                </span>
                <h3 className="text-[#f0eee9] text-2xl sm:text-3xl font-serif font-light tracking-[-0.01em] mb-3 leading-tight">
                  {t(tier.titleKey)}
                </h3>
                {tier.popular && (
                  <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/80 border border-[#c9a96e]/30 px-3 py-1.5">
                    {t("membership.mostPopular")}
                  </span>
                )}
                <div className="flex items-baseline gap-2 mt-6">
                  <span className="text-[#c9a96e] text-3xl sm:text-4xl font-serif font-light">{tier.price}</span>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#7a7a7a] font-light">{tier.period}</span>
                </div>
              </div>

              {/* Description + features */}
              <div className="md:col-span-5">
                <p className="text-[#9a9a9a] text-sm sm:text-base leading-[1.8] mb-6 font-light max-w-md">
                  {t(tier.descriptionKey)}
                </p>
                <ul className="space-y-2">
                  {tier.featureKeys.map((featureKey) => (
                    <li key={featureKey} className="text-[12px] text-[#7a7a7a] leading-[1.7] font-light flex gap-3">
                      <span className="text-[#c9a96e]/50 shrink-0">—</span>
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA — links to /membership, which handles Stripe checkout */}
              <div className="md:col-span-2 flex md:justify-end md:items-end">
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#f0eee9] border-b border-[#c9a96e]/40 pb-2 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-500 cursor-pointer self-start md:self-end"
                >
                  {t(tier.ctaKey)}
                  <span className="text-[#c9a96e]">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[#5a5a5a] text-[10px] tracking-[0.2em] mt-12 font-light">
          {t("membership.footer")}
        </p>
      </div>
    </section>
  );
}
