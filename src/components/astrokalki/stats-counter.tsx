"use client";

import { useI18n } from "@/lib/i18n-context";

const statKeys = [
  { value: 2400, suffix: "+", labelKey: "stats.sessions", descriptionKey: "stats.sessionsDesc" },
  { value: 97, suffix: "%", labelKey: "stats.returnRate", descriptionKey: "stats.returnRateDesc" },
  { value: 12, suffix: "+", labelKey: "stats.years", descriptionKey: "stats.yearsDesc" },
  { value: 38, suffix: "min", labelKey: "stats.breakthrough", descriptionKey: "stats.breakthroughDesc" },
];

export default function StatsCounter() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {statKeys.map((stat) => (
            <div key={stat.labelKey}>
              <p className="text-[#c9a96e] text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-none">
                {stat.value.toLocaleString()}
                <span className="text-[#c9a96e]/60 text-2xl sm:text-3xl">{stat.suffix}</span>
              </p>
              <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#f0eee9] mt-5 font-light">
                {t(stat.labelKey)}
              </p>
              <p className="text-[11px] text-[#5a5a5a] mt-2 font-light leading-relaxed">
                {t(stat.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
