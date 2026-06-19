"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openWhatsApp } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n-context";
import { AvailabilityIndicator } from "@/components/astrokalki/availability-indicator";

const durationKeys = [
  { value: "30", labelKey: "booking.duration30", sublabelKey: "booking.duration30sub", price: "₹1,499" },
  { value: "60", labelKey: "booking.duration60", sublabelKey: "booking.duration60sub", price: "₹1,999", recommended: true },
  { value: "90", labelKey: "booking.duration90", sublabelKey: "booking.duration90sub", price: "₹2,999" },
];

const contextKeys = [
  "booking.ctx1", "booking.ctx2", "booking.ctx3", "booking.ctx4",
  "booking.ctx5", "booking.ctx6", "booking.ctx7", "booking.ctx8",
];

// ─── Slot types ──────────────────────────────────────────────────

interface Slot {
  id: string;
  start: string; // ISO
  end: string;   // ISO
  duration: number;
  status: string;
}

const STEPS = [
  { id: 1, labelKey: "booking.step.duration" },
  { id: 2, labelKey: "booking.step.slot" },
  { id: 3, labelKey: "booking.step.context" },
  { id: 4, labelKey: "booking.step.details" },
  { id: 5, labelKey: "booking.step.confirm" },
];

// ─── Date / time formatting helpers (render in IST) ─────────────

function formatSlotTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function dateGroupKey(iso: string): string {
  const d = new Date(iso);
  const ist = new Date(d.getTime() + 330 * 60_000);
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, "0")}-${String(ist.getUTCDate()).padStart(2, "0")}`;
}

// ─── Component ───────────────────────────────────────────────────

export default function Booking() {
  const [step, setStep] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [skippedSlot, setSkippedSlot] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", birthDate: "", birthTime: "", birthPlace: "", message: "",
    referredBy: "",
  });
  const { t } = useI18n();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotsFetchedFor, setSlotsFetchedFor] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Referral pre-fill — on mount, check the URL for ?ref=CODE and pre-fill the
  // referredBy field. This connects the /refer shareable link to the booking
  // flow. We use window.location directly (not useSearchParams) to avoid
  // forcing a Suspense boundary on the parent homepage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const rawRef = params.get("ref");
    if (!rawRef) return;
    // Normalise: trim, uppercase, cap at 32 chars (defensive — codes are 8).
    const code = rawRef.trim().toUpperCase().slice(0, 32);
    if (!code) return;
    setFormData((prev) => (prev.referredBy === code ? prev : { ...prev, referredBy: code }));
  }, []);

  const toggleContext = (ctx: string) => {
    setSelectedContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx]
    );
  };

  const fetchSlots = useCallback(async (duration: string) => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const res = await fetch(`/api/slots?duration=${duration}`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setSlots(data.slots || []);
      setSlotsFetchedFor(duration);
    } catch {
      setSlotsError(t("booking.slotRetry"));
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [t]);

  // Whenever we enter the slot-picker step, fetch slots for the chosen duration.
  useEffect(() => {
    if (step === 2 && selectedDuration && slotsFetchedFor !== selectedDuration) {
      fetchSlots(selectedDuration);
    }
  }, [step, selectedDuration, slotsFetchedFor, fetchSlots]);

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const canProceed = () => {
    if (step === 1) return selectedDuration !== null;
    if (step === 2) return selectedSlot !== null || skippedSlot;
    if (step === 3) return selectedContexts.length > 0;
    if (step === 4) return formData.name && formData.email;
    return true;
  };

  const getPrice = () => {
    if (selectedDuration === "30") return "₹1,499";
    if (selectedDuration === "60") return "₹1,999";
    if (selectedDuration === "90") return "₹2,999";
    return "";
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setSkippedSlot(false);
  };

  const handleSkipSlot = () => {
    setSelectedSlot(null);
    setSkippedSlot(true);
  };

  // ─── Final submission ─────────────────────────────────────────
  // If a slot is selected, POST to /api/slots/[id] (self-serve calendar booking).
  // If skipped (fallback), behave like the original WhatsApp flow + POST /api/bookings.
  const handleFinalSubmit = async () => {
    setBookingError(null);
    setSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      duration: selectedDuration,
      price: getPrice(),
      contexts: selectedContexts,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace,
      message: formData.message,
      // Pass through the referredBy code (may be auto-filled from ?ref=CODE on
      // mount, or entered manually by the user). Empty string is fine — the
      // API coerces empty/null to null in the DB.
      referredBy: formData.referredBy || undefined,
      // Honeypot — must be empty for real users.
      website: "",
    };

    if (selectedSlot) {
      // Self-serve calendar booking path.
      try {
        const res = await fetch(`/api/slots/${selectedSlot.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setBookingError(data.error || t("booking.bookingError"));
          setSubmitting(false);
          return;
        }
        // Fire a non-blocking analytics event.
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "booking_complete",
            data: { duration: selectedDuration, price: getPrice(), slot: selectedSlot.id },
            page: "/",
          }),
        }).catch(() => {});
        setBookingSuccess(true);
      } catch {
        setBookingError(t("booking.bookingError"));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Fallback WhatsApp path (legacy).
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* non-fatal — log only */
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "booking_complete", data: { duration: selectedDuration, price: getPrice() }, page: "/" }),
    }).catch(() => {});

    let birthDetails = "";
    if (formData.birthDate || formData.birthTime || formData.birthPlace) {
      const parts: string[] = [];
      if (formData.birthDate) parts.push(formData.birthDate);
      if (formData.birthTime) parts.push(formData.birthTime);
      if (formData.birthPlace) parts.push(formData.birthPlace);
      birthDetails = parts.join(", ");
    }

    openWhatsApp({
      type: "booking",
      name: formData.name, email: formData.email, phone: formData.phone,
      duration: selectedDuration || "", price: getPrice(),
      contexts: selectedContexts,
      birthDetails: birthDetails || undefined,
      message: formData.message || undefined,
    });

    setBookingSuccess(true);
    setSubmitting(false);
  };

  // ─── Group slots by date for the slot-picker step ─────────────
  const groupedSlots = (() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = dateGroupKey(s.start);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.start.localeCompare(b.start));
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  })();

  return (
    <section id="booking" className="relative py-32 sm:py-48 px-6 sm:px-10 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Live availability line — sits above every step so visitors see
            AstroKalki's current state at a glance. Renders nothing while
            the socket is disconnected (no broken indicator). */}
        <div className="mb-10 sm:mb-14 flex items-center">
          <AvailabilityIndicator variant="line" />
        </div>

        {/* Step 0: Emotional landing */}
        {step === 0 && (
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-8 font-light">
              {t("booking.label")}
            </p>
            <h2 className="text-[#f0eee9] text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-serif max-w-2xl mb-8">
              {t("booking.headline1")}{" "}
              <span className="text-[#c9a96e] italic font-light">{t("booking.headline2")}</span>
            </h2>
            <p className="text-[#9a9a9a] text-sm sm:text-base leading-[1.85] max-w-md mb-12 font-light">
              {t("booking.subtitle")}
            </p>
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-[#f0eee9] border-b border-[#c9a96e]/50 pb-3 hover:border-[#c9a96e] transition-colors duration-500 cursor-pointer"
            >
              {t("booking.beginIntake")}
              <span className="text-[#c9a96e]">→</span>
            </button>
          </div>
        )}

        {/* Steps 1-5 */}
        {step > 0 && step < 6 && (
          <>
            {/* Minimal progress indicator — 5 steps */}
            <div className="mb-16" role="navigation" aria-label="Booking progress">
              <div className="flex items-center justify-between mb-3 text-[10px] tracking-[0.3em] uppercase font-mono font-light">
                {STEPS.map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-3 ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                    <span
                      aria-current={s.id === step ? "step" : undefined}
                      className={s.id <= step ? "text-[#c9a96e]" : "text-[#3a3a3a]"}
                    >
                      {String(s.id).padStart(2, "0")}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-px ${s.id < step ? "bg-[#c9a96e]/40" : "bg-white/[0.06]"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] tracking-[0.25em] uppercase text-[#5a5a5a] font-light">
                {STEPS.map((s) => (
                  <span
                    key={s.id}
                    aria-current={s.id === step ? "step" : undefined}
                    className={`text-center flex-1 first:text-left last:text-right ${
                      s.id === step ? "text-[#c9a96e]" : ""
                    }`}
                  >
                    {t(s.labelKey)}
                  </span>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Step 1 — Duration */}
                {step === 1 && (
                  <div>
                    <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-10 font-light">
                      {t("booking.howDeep")}
                    </p>
                    <div className="border-t border-white/[0.06]">
                      {durationKeys.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => {
                            setSelectedDuration(d.value);
                            // Reset slot state when duration changes.
                            setSelectedSlot(null);
                            setSkippedSlot(false);
                          }}
                          className={`w-full text-left py-6 border-b border-white/[0.06] transition-colors duration-400 cursor-pointer grid grid-cols-12 gap-4 items-baseline px-2 ${
                            selectedDuration === d.value ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"
                          }`}
                        >
                          <div className="col-span-12 sm:col-span-7">
                            <p className={`text-base sm:text-lg font-serif font-light ${selectedDuration === d.value ? "text-[#c9a96e]" : "text-[#f0eee9]"}`}>
                              {t(d.labelKey)}
                              {d.recommended && (
                                <span className="ml-3 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]/70 border border-[#c9a96e]/30 px-2 py-0.5 font-light">
                                  {t("booking.recommended")}
                                </span>
                              )}
                            </p>
                            <p className="text-[12px] text-[#7a7a7a] mt-2 font-light">{t(d.sublabelKey)}</p>
                          </div>
                          <div className="col-span-12 sm:col-span-5 sm:text-right">
                            <p className="text-[#c9a96e] text-lg font-serif font-light">{d.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 — Slot picker (NEW) */}
                {step === 2 && (
                  <div>
                    <p className="text-[#f0eee9] text-xl sm:text-2xl font-serif font-light mb-3 leading-tight">
                      {t("booking.slotTitle")}
                    </p>
                    <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-10 font-light">
                      {t("booking.slotSubtitle")}
                    </p>

                    {/* Loading state */}
                    {slotsLoading && (
                      <div className="border-t border-white/[0.06] py-10 text-center">
                        <p className="text-[#7a7a7a] text-sm font-light animate-pulse">
                          {t("booking.slotLoading")}
                        </p>
                      </div>
                    )}

                    {/* Error state */}
                    {!slotsLoading && slotsError && (
                      <div className="border-t border-white/[0.06] py-10 text-center">
                        <p className="text-[#7a7a7a] text-sm font-light mb-4">
                          {slotsError}
                        </p>
                        <button
                          onClick={() => selectedDuration && fetchSlots(selectedDuration)}
                          className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] border-b border-[#c9a96e]/40 pb-2 hover:border-[#c9a96e] transition-colors cursor-pointer"
                        >
                          {t("booking.slotRetryBtn")} →
                        </button>
                      </div>
                    )}

                    {/* Empty state */}
                    {!slotsLoading && !slotsError && slots.length === 0 && (
                      <div className="border-t border-white/[0.06] py-10">
                        <p className="text-[#9a9a9a] text-sm font-light mb-2 text-center">
                          {t("booking.slotEmpty")}
                        </p>
                        <p className="text-[#7a7a7a] text-xs font-light mb-6 text-center max-w-md mx-auto">
                          {t("booking.slotEmptyHint")}
                        </p>
                        <div className="text-center">
                          <button
                            onClick={handleSkipSlot}
                            className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] border-b border-[#c9a96e]/40 pb-2 hover:border-[#c9a96e] transition-colors cursor-pointer"
                          >
                            {t("booking.slotEmptyCta")} →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Slots list — grouped by date */}
                    {!slotsLoading && !slotsError && slots.length > 0 && (
                      <div className="space-y-8 max-h-[28rem] overflow-y-auto pr-2 -mr-2
                        [scrollbar-width:thin] [scrollbar-color:#c9a96e40_transparent]
                        [&::-webkit-scrollbar]:w-[3px]
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-[#c9a96e]/30
                        [&::-webkit-scrollbar-thumb:hover]:bg-[#c9a96e]/60">
                        {groupedSlots.map(([dateKey, daySlots]) => (
                          <div key={dateKey}>
                            {/* Day header — Cinzel uppercase, thin gold divider */}
                            <div className="flex items-center gap-3 mb-3">
                              <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-light"
                                 style={{ fontFamily: "Cinzel, serif" }}>
                                {formatDateLong(daySlots[0].start)}
                              </p>
                              <div className="flex-1 h-px bg-[#c9a96e]/15" />
                            </div>
                            {/* Time slots — borderless cards with bottom underline on hover */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px">
                              {daySlots.map((slot) => {
                                const isSelected = selectedSlot?.id === slot.id;
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`text-left px-3 py-3 transition-all duration-300 cursor-pointer border-b ${
                                      isSelected
                                        ? "border-[#c9a96e] bg-[#c9a96e]/[0.06]"
                                        : "border-white/[0.04] hover:border-[#c9a96e]/40 hover:bg-white/[0.015]"
                                    }`}
                                  >
                                    <p className={`font-mono text-sm ${isSelected ? "text-[#c9a96e]" : "text-[#f0eee9]"} font-light`}>
                                      {formatSlotTime(slot.start)}
                                    </p>
                                    <p className="text-[10px] text-[#5a5a5a] mt-0.5 font-light">
                                      {slot.duration} min
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected slot chip + skip link */}
                    {!slotsLoading && !slotsError && slots.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                        {selectedSlot ? (
                          <p className="text-[11px] tracking-[0.2em] uppercase text-[#c9a96e] font-light">
                            {t("booking.slotSelected")}:{" "}
                            <span className="font-mono normal-case tracking-normal">
                              {formatDateShort(selectedSlot.start)} · {formatSlotTime(selectedSlot.start)}
                            </span>
                          </p>
                        ) : (
                          <span className="text-[11px] text-[#5a5a5a] font-light">
                            {t("booking.confirmSlotNone")}
                          </span>
                        )}
                        <button
                          onClick={handleSkipSlot}
                          className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] hover:text-[#f0eee9] transition-colors cursor-pointer"
                        >
                          {t("booking.slotFallbackCta")} →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3 — Context (what resonates) */}
                {step === 3 && (
                  <div>
                    <p className="text-[#9a9a9a] text-sm leading-[1.8] mb-10 font-light">
                      {t("booking.whatResonates")}
                    </p>
                    <div className="border-t border-white/[0.06]">
                      {contextKeys.map((ctxKey, i) => (
                        <button
                          key={ctxKey}
                          onClick={() => toggleContext(ctxKey)}
                          className={`w-full text-left py-4 border-b border-white/[0.06] transition-colors duration-400 cursor-pointer flex items-baseline gap-4 px-2 ${
                            selectedContexts.includes(ctxKey) ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"
                          }`}
                        >
                          <span className={`text-[10px] tracking-[0.2em] font-mono ${
                            selectedContexts.includes(ctxKey) ? "text-[#c9a96e]" : "text-[#3a3a3a]"
                          }`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`text-sm font-light flex-1 ${
                            selectedContexts.includes(ctxKey) ? "text-[#c9a96e]" : "text-[#9a9a9a]"
                          }`}>
                            {t(ctxKey)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 — Your details */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* Referral pre-fill indicator — shown when ?ref=CODE was
                        detected on mount and used to pre-fill the referredBy
                        field. Subtle, gold-tinted, dismissive in tone so it
                        doesn't dominate the form. */}
                    {formData.referredBy && (
                      <div className="border border-[#c9a96e]/20 bg-[#c9a96e]/[0.04] px-4 py-3 flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="text-[#c9a96e] text-xs mt-0.5 tracking-widest"
                        >
                          ✦
                        </span>
                        <div className="flex-1">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 mb-1 font-light">
                            You were referred
                          </p>
                          <p className="text-[12px] text-[#cfcabf] font-light leading-relaxed">
                            Referred by{" "}
                            <code className="font-mono text-[#c9a96e] tracking-[0.1em]">
                              {formData.referredBy}
                            </code>
                            . You can edit or clear this field below — your
                            referrer earns a free 30-minute follow-up when you
                            book.
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-[#9a9a9a] text-sm leading-[1.8] font-light">
                      {t("booking.prepareChart")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { labelKey: "booking.field.fullName", key: "name" as const, type: "text", placeholderKey: "booking.placeholder.name", autocomplete: "name", required: true },
                        { labelKey: "booking.field.email", key: "email" as const, type: "email", placeholderKey: "booking.placeholder.email", autocomplete: "email", required: true },
                        { labelKey: "booking.field.phone", key: "phone" as const, type: "tel", placeholderKey: "booking.placeholder.phone", autocomplete: "tel", required: false },
                        { labelKey: "booking.field.birthDate", key: "birthDate" as const, type: "date", placeholderKey: "", autocomplete: "bday", required: false },
                        { labelKey: "booking.field.birthTime", key: "birthTime" as const, type: "time", placeholderKey: "", autocomplete: "off", required: false },
                        { labelKey: "booking.field.birthPlace", key: "birthPlace" as const, type: "text", placeholderKey: "booking.placeholder.birthPlace", autocomplete: "off", required: false },
                      ].map((field) => {
                        const fieldId = `booking-field-${field.key}`;
                        // Surface the form-level error to AT: when bookingError
                        // is set, mark every detail input aria-invalid so screen
                        // readers announce "invalid entry" on focus, and link
                        // each input to the live error message via aria-describedby.
                        const hasFormError = !!bookingError;
                        return (
                          <div key={field.key}>
                            <label
                              htmlFor={fieldId}
                              className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] mb-2 block font-light"
                            >
                              {t(field.labelKey)}
                              {field.required && (
                                <span aria-hidden="true" className="text-[#c9a96e]/70 ml-1">*</span>
                              )}
                            </label>
                            <input
                              id={fieldId}
                              type={field.type}
                              autoComplete={field.autocomplete}
                              value={formData[field.key]}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                              required={field.required}
                              aria-required={field.required || undefined}
                              aria-invalid={hasFormError || undefined}
                              aria-describedby={hasFormError ? "booking-error" : undefined}
                              className="w-full bg-transparent border-b border-white/[0.1] px-1 py-2 text-sm text-[#f0eee9] focus:border-[#c9a96e]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] transition-colors placeholder:text-[#3a3a3a] font-light"
                              placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="booking-field-message"
                        className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] mb-2 block font-light"
                      >
                        {t("booking.field.anythingElse")}
                      </label>
                      <textarea
                        id="booking-field-message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        aria-invalid={!!bookingError || undefined}
                        aria-describedby={bookingError ? "booking-error" : undefined}
                        className="w-full bg-transparent border-b border-white/[0.1] px-1 py-2 text-sm text-[#f0eee9] focus:border-[#c9a96e]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] transition-colors resize-none placeholder:text-[#3a3a3a] font-light"
                        placeholder={t("booking.placeholder.message")}
                      />
                    </div>
                    {/* Referred by (optional) — pre-filled from ?ref=CODE on
                        mount, but editable / clearable. Sits below the message
                        field so it doesn't crowd the required contact fields.
                        Uses mono font + uppercase transform so it visually
                        matches the code format on /refer. */}
                    <div className="mt-6">
                      <label
                        htmlFor="booking-field-referredBy"
                        className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] mb-2 block font-light"
                      >
                        Referred by <span className="text-[#5a5a5a] normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        id="booking-field-referredBy"
                        type="text"
                        autoComplete="off"
                        value={formData.referredBy}
                        onChange={(e) => setFormData({ ...formData, referredBy: e.target.value.toUpperCase() })}
                        aria-describedby="booking-field-referredBy-help"
                        aria-invalid={!!bookingError || undefined}
                        className="w-full bg-transparent border-b border-white/[0.1] px-1 py-2 text-sm text-[#f0eee9] focus:border-[#c9a96e]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] transition-colors placeholder:text-[#3a3a3a] font-mono tracking-[0.1em] uppercase"
                        placeholder="e.g. MXDMN4RH"
                        maxLength={32}
                      />
                      <p id="booking-field-referredBy-help" className="mt-1.5 text-[10px] text-[#5a5a5a] font-light leading-relaxed">
                        If a friend shared an AstroKalki code with you, paste it
                        here. They&apos;ll earn a free follow-up when you book.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5 — Confirm + submit */}
                {step === 5 && (
                  <div className="py-4">
                    {/* Success state (after submission) */}
                    {bookingSuccess ? (
                      <div className="text-center py-8">
                        <motion.div
                          initial={{ scale: 0.92, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e]/60 mb-6 font-light">
                            {t("booking.label")}
                          </p>
                          <h3 className="text-[#f0eee9] text-2xl sm:text-3xl font-serif font-light mb-4 leading-tight">
                            {selectedSlot
                              ? t("booking.bookingSuccessTitle")
                              : t("booking.sessionReady")}
                          </h3>
                          <p className="text-[#9a9a9a] text-sm leading-[1.8] max-w-md mx-auto mb-8 font-light">
                            {selectedSlot
                              ? `${t("booking.bookingSuccessBody")}`
                              : t("booking.completeViaWhatsApp")}
                          </p>
                          {selectedSlot && (
                            <div className="inline-block border border-[#c9a96e]/20 bg-[#c9a96e]/[0.04] px-6 py-4 mb-6">
                              <p className="text-[9px] tracking-[0.3em] uppercase text-[#7a7a7a] mb-1 font-light">
                                {t("booking.confirmSlot")}
                              </p>
                              <p className="text-[#f0eee9] text-base font-serif font-light">
                                {formatDateLong(selectedSlot.start)}
                              </p>
                              <p className="text-[#c9a96e] font-mono text-sm mt-1">
                                {formatSlotTime(selectedSlot.start)} — {formatSlotTime(selectedSlot.end)} (IST)
                              </p>
                            </div>
                          )}
                          <div>
                            <button
                              onClick={() => {
                                // Reset entire flow back to landing.
                                // Preserve referredBy — the URL still has
                                // ?ref=CODE and we want it pre-filled if they
                                // book again in the same session.
                                const preservedRef = formData.referredBy;
                                setStep(0);
                                setSelectedDuration(null);
                                setSelectedSlot(null);
                                setSkippedSlot(false);
                                setSelectedContexts([]);
                                setFormData({
                                  name: "", email: "", phone: "",
                                  birthDate: "", birthTime: "", birthPlace: "", message: "",
                                  referredBy: preservedRef,
                                });
                                setBookingSuccess(false);
                                setBookingError(null);
                                setSlots([]);
                                setSlotsFetchedFor(null);
                              }}
                              className="text-[11px] tracking-[0.3em] uppercase text-[#7a7a7a] hover:text-[#f0eee9] transition-colors cursor-pointer"
                            >
                              {t("booking.back")}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-[#f0eee9] text-xl sm:text-2xl font-serif font-light mb-4 leading-tight">
                          {t("booking.sessionReady")}
                        </h3>
                        <p className="text-[#9a9a9a] text-sm leading-[1.8] max-w-md mb-10 font-light">
                          {selectedSlot
                            ? t("booking.bookingSuccessBody")
                            : t("booking.completeViaWhatsApp")}
                        </p>
                        <div className="border-t border-white/[0.06] pt-6 max-w-md">
                          <p className="text-[9px] tracking-[0.3em] uppercase text-[#7a7a7a] mb-4 font-light">
                            {t("booking.summary")}
                          </p>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#7a7a7a] font-light">{t("booking.summaryDuration")}</span>
                              <span className="text-[#f0eee9] font-light">{selectedDuration} min</span>
                            </div>
                            {selectedSlot && (
                              <div className="flex justify-between gap-4">
                                <span className="text-[#7a7a7a] font-light shrink-0">{t("booking.confirmSlot")}</span>
                                <span className="text-[#f0eee9] font-light text-right font-mono">
                                  {formatDateShort(selectedSlot.start)} · {formatSlotTime(selectedSlot.start)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-[#7a7a7a] font-light">{t("booking.summaryFocus")}</span>
                              <span className="text-[#f0eee9] font-light">{selectedContexts.length} {t("booking.summarySelected")}</span>
                            </div>
                            {formData.referredBy && (
                              <div className="flex justify-between gap-4">
                                <span className="text-[#7a7a7a] font-light shrink-0">Referral</span>
                                <span className="text-[#c9a96e] font-mono tracking-[0.1em] text-right">
                                  {formData.referredBy}
                                </span>
                              </div>
                            )}
                            <div className="border-t border-white/[0.06] pt-3 mt-3 flex justify-between">
                              <span className="text-[#c9a96e] font-light">{t("booking.investment")}</span>
                              <span className="text-[#c9a96e] font-serif">{getPrice()}</span>
                            </div>
                          </div>
                        </div>

                        {bookingError && (
                          <p id="booking-error" role="alert" aria-live="assertive" className="mt-6 text-red-400/80 text-sm font-light border-l-2 border-red-400/40 pl-3">
                            {bookingError}
                          </p>
                        )}

                        {/* Primary CTA — changes based on slot availability */}
                        {selectedSlot ? (
                          <button
                            onClick={handleFinalSubmit}
                            disabled={submitting}
                            className="mt-10 inline-flex items-center gap-3 bg-[#c9a96e] hover:bg-[#d4b97e] text-[#050505] px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {submitting ? t("booking.submitting") : t("booking.finalizeBooking")}
                            {!submitting && <span>→</span>}
                          </button>
                        ) : (
                          <button
                            onClick={handleFinalSubmit}
                            disabled={submitting}
                            className="mt-10 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-[#050505] px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            {submitting ? t("booking.submitting") : t("booking.finalizeWhatsApp")}
                          </button>
                        )}
                        <p className="text-[10px] text-[#5a5a5a] mt-4 tracking-wide font-light">
                          {selectedSlot
                            ? t("booking.bookingSuccessBody")
                            : t("booking.prefilledNote")}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step navigation (hidden on final step + on success state) */}
            {step > 0 && step < 5 && !bookingSuccess && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={handleBack}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#7a7a7a] hover:text-[#f0eee9] transition-colors duration-500 cursor-pointer font-light"
                >
                  ← {t("booking.back")}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer hover:text-[#f0eee9] transition-colors font-light"
                >
                  {t("booking.continueBtn")} →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
