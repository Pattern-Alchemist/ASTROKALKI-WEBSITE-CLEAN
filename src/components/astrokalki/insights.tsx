"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";

const insightKeys = [
  { slug: "why-you-keep-going-back", categoryKey: "insights.article1.category", titleKey: "insights.article1.title", excerptKey: "insights.article1.excerpt", readTime: "7 min" },
  { slug: "the-part-of-you-that-wants-you-to-fail", categoryKey: "insights.article2.category", titleKey: "insights.article2.title", excerptKey: "insights.article2.excerpt", readTime: "6 min" },
  { slug: "you-didnt-choose-this-pain", categoryKey: "insights.article3.category", titleKey: "insights.article3.title", excerptKey: "insights.article3.excerpt", readTime: "8 min" },
  { slug: "fear-of-being-seen", categoryKey: "insights.article4.category", titleKey: "insights.article4.title", excerptKey: "insights.article4.excerpt", readTime: "5 min" },
  { slug: "the-lie-you-tell-yourself", categoryKey: "insights.article5.category", titleKey: "insights.article5.title", excerptKey: "insights.article5.excerpt", readTime: "6 min" },
];

export default function Insights() {
  const { t } = useI18n();

  return (
    <section id="insights" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20 sm:mb-28">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
            {t("insights.label")}
          </p>
          <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-3xl">
            {t("insights.headline1")}{" "}
            <span className="text-[#6a6a6a] italic font-light">{t("insights.headline2")}</span>
          </h2>
        </div>

        <div className="border-t border-white/[0.06]">
          {insightKeys.map((insight) => (
            <article key={insight.slug}>
              <Link
                href={`/insights/${insight.slug}`}
                className="group block border-b border-white/[0.06] py-10 sm:py-12 grid grid-cols-12 gap-6 hover:bg-white/[0.015] transition-colors duration-500"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/50 font-light">
                    {t(insight.categoryKey)}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-[#f0eee9] text-xl sm:text-2xl md:text-3xl font-serif font-light leading-tight group-hover:text-[#c9a96e] transition-colors duration-500 mb-3">
                    {t(insight.titleKey)}
                  </h3>
                  <p className="text-[#7a7a7a] text-sm leading-[1.7] max-w-md font-light">
                    {t(insight.excerptKey)}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-3 flex md:flex-col md:items-end justify-between md:justify-start gap-2">
                  <span className="text-[10px] tracking-[0.2em] text-[#5a5a5a] font-light">
                    {insight.readTime}
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] group-hover:text-[#c9a96e] transition-colors duration-500 font-light">
                    Read →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <InsightTracker />
      </div>
    </section>
  );
}

function InsightTracker() {
  const [tracked, setTracked] = useState(false);
  useEffect(() => {
    if (tracked) return;
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "section_view", data: { section: "insights" }, page: "/" }),
    }).catch(() => {});
    setTracked(true);
  }, [tracked]);
  return null;
}
