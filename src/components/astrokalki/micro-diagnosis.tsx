"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { openWhatsApp } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n-context";

const patternIds = [
  { id: "heartbreak", labelKey: "microDiagnosis.pattern.heartbreak", insightKey: "microDiagnosis.pattern.heartbreak.insight" },
  { id: "sabotage", labelKey: "microDiagnosis.pattern.sabotage", insightKey: "microDiagnosis.pattern.sabotage.insight" },
  { id: "misunderstood", labelKey: "microDiagnosis.pattern.misunderstood", insightKey: "microDiagnosis.pattern.misunderstood.insight" },
  { id: "exhaustion", labelKey: "microDiagnosis.pattern.exhaustion", insightKey: "microDiagnosis.pattern.exhaustion.insight" },
  { id: "purpose", labelKey: "microDiagnosis.pattern.purpose", insightKey: "microDiagnosis.pattern.purpose.insight" },
  { id: "attachment", labelKey: "microDiagnosis.pattern.attachment", insightKey: "microDiagnosis.pattern.attachment.insight" },
];

export default function MicroDiagnosis() {
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useI18n();

  const togglePattern = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    const selectedLabels = patternIds
      .filter((p) => selected.includes(p.id))
      .map((p) => t(p.labelKey));

    openWhatsApp({
      type: "booking",
      name: "",
      email: "",
      duration: "",
      price: "",
      contexts: selectedLabels,
      message: `Pattern self-diagnosis: ${selectedLabels.join(", ")}`,
    });
  };

  return (
    <section id="micro-diagnosis" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Section header — appears instantly, no reveal animation */}
        <div className="mb-20 sm:mb-24">
          {/* Thin gold marker — signals "begin here" without decoration */}
          <div className="w-12 h-px bg-[#c9a96e]/40 mb-10" />
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e] mb-8 font-light">
            {t("microDiagnosis.label")}
          </p>
          <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-2xl">
            {t("microDiagnosis.headline1")}{" "}
            <span className="text-[#c9a96e] italic font-light">{t("microDiagnosis.headline2")}</span>
          </h2>
        </div>

        {/* Pattern options — pure typographic list, no boxes */}
        <div className="border-t border-white/[0.06]">
          {patternIds.map((pattern, i) => (
            <button
              key={pattern.id}
              onClick={() => togglePattern(pattern.id)}
              className={`w-full text-left border-b border-white/[0.06] py-6 sm:py-8 grid grid-cols-12 gap-6 items-baseline transition-colors duration-500 ${
                selected.includes(pattern.id) ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"
              }`}
            >
              <span className="col-span-2 sm:col-span-1 text-[11px] tracking-[0.3em] text-[#c9a96e]/40 font-mono pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-10 sm:col-span-11">
                <p className={`text-lg sm:text-xl md:text-2xl font-serif font-light leading-tight transition-colors duration-500 ${
                  selected.includes(pattern.id) ? "text-[#c9a96e]" : "text-[#9a9a9a] hover:text-[#f0eee9]"
                }`}>
                  {t(pattern.labelKey)}
                </p>
                {selected.includes(pattern.id) && (
                  <p className="text-[#c9a96e]/70 text-[13px] italic mt-3 font-light leading-relaxed">
                    {t(pattern.insightKey)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Continue CTA */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="mt-16 sm:mt-20"
            >
              <p className="text-[#9a9a9a] text-sm leading-relaxed mb-8 max-w-md font-light">
                {selected.length === 1
                  ? t("microDiagnosis.onePattern")
                  : `${selected.length} ${t("microDiagnosis.multiplePatterns")}`}
                {" "}{t("microDiagnosis.notCoincidence")}
              </p>
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-[#f0eee9] border-b border-[#c9a96e]/50 pb-3 hover:border-[#c9a96e] transition-colors duration-500 cursor-pointer"
              >
                {t("microDiagnosis.continue")}
                <span className="text-[#c9a96e]">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
