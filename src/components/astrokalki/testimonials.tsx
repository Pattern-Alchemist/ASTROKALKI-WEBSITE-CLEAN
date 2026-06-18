"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

const testimonialKeys = [
  { quoteKey: "testimonials.quote1", contextKey: "testimonials.context1", initials: "R.K.", detail: "Mumbai" },
  { quoteKey: "testimonials.quote2", contextKey: "testimonials.context2", initials: "A.S.", detail: "Delhi" },
  { quoteKey: "testimonials.quote3", contextKey: "testimonials.context3", initials: "P.M.", detail: "Bangalore" },
  { quoteKey: "testimonials.quote4", contextKey: "testimonials.context4", initials: "V.N.", detail: "Pune" },
  { quoteKey: "testimonials.quote5", contextKey: "testimonials.context5", initials: "S.T.", detail: "Chennai" },
  { quoteKey: "testimonials.quote6", contextKey: "testimonials.context6", initials: "M.J.", detail: "Hyderabad" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { t } = useI18n();

  const next = () => setCurrent((prev) => (prev + 1) % testimonialKeys.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonialKeys.length) % testimonialKeys.length);
  const tk = testimonialKeys[current];

  return (
    <section id="testimonials" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-20 sm:mb-28">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
            {t("testimonials.label")}
          </p>
          <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-3xl">
            {t("testimonials.headline1")}{" "}
            <span className="text-[#6a6a6a] italic font-light">{t("testimonials.headline2")}</span>
          </h2>
        </div>

        {/* Quote — pure typography, no card, no avatar */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-[#f0eee9] text-[clamp(1.25rem,3vw,2rem)] font-serif italic font-light leading-[1.5] max-w-3xl">
                &ldquo;{t(tk.quoteKey)}&rdquo;
              </p>
              <div className="mt-10 flex items-baseline gap-4">
                <span className="text-[11px] tracking-[0.3em] text-[#c9a96e]/70 font-mono">
                  {tk.initials}
                </span>
                <span className="text-[12px] text-[#7a7a7a] font-light">
                  {t(tk.contextKey)} — {tk.detail}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Minimal navigation — just dots and counter */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/[0.06]">
            <span className="text-[10px] tracking-[0.3em] text-[#7a7a7a] font-mono font-light">
              {String(current + 1).padStart(2, "0")} / {String(testimonialKeys.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={prev}
                className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] hover:text-[#f0eee9] transition-colors duration-500 cursor-pointer font-light"
                aria-label="Previous"
              >
                ←
              </button>
              <div className="flex gap-2">
                {testimonialKeys.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-px transition-all duration-500 cursor-pointer ${
                      i === current ? "w-8 bg-[#c9a96e]" : "w-4 bg-white/[0.15]"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] hover:text-[#f0eee9] transition-colors duration-500 cursor-pointer font-light"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
