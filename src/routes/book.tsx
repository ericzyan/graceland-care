"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronLeft, MessageCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/Logo-02.svg";
import { sendBookingRequest, type BookingData } from "@/lib/booking";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment | Graceland Integrated Care" },
      {
        name: "description",
        content:
          "Request a nursing appointment with Graceland Integrated Care. DVA, NDIS and Aged Care community nursing in Brisbane.",
      },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = {
  // Step 1
  careFor: "" | "myself" | "family" | "client";
  funding: "" | "DVA" | "NDIS" | "Aged Care" | "Not sure";
  // Step 2
  appointmentType: "" | "phone" | "home";
  preferredDate: string;
  timeWindow: "" | "Morning" | "Afternoon" | "Evening";
  // Step 3
  fullName: string;
  phone: string;
  email: string;
  suburb: string;
  note: string;
  consent: boolean;
};

const initial: FormState = {
  careFor: "",
  funding: "",
  appointmentType: "",
  preferredDate: "",
  timeWindow: "",
  fullName: "",
  phone: "",
  email: "",
  suburb: "",
  note: "",
  consent: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function OptionCard({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[56px] w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-brand-blue bg-brand-blue/5"
          : "border-brand-border bg-white hover:border-brand-blue/40"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-brand-blue bg-brand-blue" : "border-brand-border"
        }`}
      >
        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
      </span>
      <span>
        <span className="block font-semibold text-brand-navy">{label}</span>
        {sub && <span className="text-sm text-brand-muted">{sub}</span>}
      </span>
    </button>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-600">{msg}</p>;
}

// ─── Step components ──────────────────────────────────────────────────────────
function Step1({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-semibold text-brand-navy">Who is the care for?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["myself", "Myself", "I need care"],
              ["family", "A family member", "Caring for someone close"],
              ["client", "A client I support", "I work in care or support"],
            ] as const
          ).map(([val, label, sub]) => (
            <OptionCard
              key={val}
              label={label}
              sub={sub}
              selected={form.careFor === val}
              onClick={() => setForm({ ...form, careFor: val })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 font-semibold text-brand-navy">Funding type</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["DVA", "Veterans & war widows"],
              ["NDIS", "NDIS participants"],
              ["Aged Care", "Older Australians at home"],
              ["Not sure", "I'm not sure yet"],
            ] as const
          ).map(([val, sub]) => (
            <OptionCard
              key={val}
              label={val}
              sub={sub}
              selected={form.funding === val}
              onClick={() => setForm({ ...form, funding: val })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-semibold text-brand-navy">Appointment type</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              [
                "phone",
                "Free phone consultation",
                "A nurse calls you to discuss your needs — no obligation.",
              ],
              [
                "home",
                "Home visit assessment",
                "A nurse visits you at home to conduct a full care assessment.",
              ],
            ] as const
          ).map(([val, label, sub]) => (
            <OptionCard
              key={val}
              label={label}
              sub={sub}
              selected={form.appointmentType === val}
              onClick={() => setForm({ ...form, appointmentType: val })}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className="mb-2 block font-semibold text-brand-navy">
            Preferred date
          </label>
          <input
            id="preferredDate"
            type="date"
            min={todayString()}
            value={form.preferredDate}
            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
            className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-navy transition-colors focus:border-brand-blue focus:outline-none"
          />
        </div>
        <div>
          <p className="mb-2 font-semibold text-brand-navy">Preferred time</p>
          <div className="grid grid-cols-3 gap-2">
            {(["Morning", "Afternoon", "Evening"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, timeWindow: t })}
                className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                  form.timeWindow === t
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-border text-brand-navy hover:border-brand-blue/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Step3Errors = Partial<Record<keyof FormState, string>>;

function Step3({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: Step3Errors;
}) {
  const field = (
    id: keyof FormState,
    label: string,
    type: string,
    placeholder?: string
  ) => (
    <div>
      <label htmlFor={id} className="mb-2 block font-semibold text-brand-navy">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={form[id] as string}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-brand-navy transition-colors focus:outline-none ${
          errors[id] ? "border-red-400" : "border-brand-border focus:border-brand-blue"
        }`}
        autoComplete={
          id === "fullName"
            ? "name"
            : id === "phone"
            ? "tel"
            : id === "email"
            ? "email"
            : undefined
        }
      />
      <FieldError msg={errors[id]} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("fullName", "Full name", "text", "Jane Smith")}
        {field("phone", "Phone number", "tel", "04XX XXX XXX")}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("email", "Email address", "email", "jane@example.com")}
        {field("suburb", "Suburb", "text", "e.g. Chermside")}
      </div>
      <div>
        <label htmlFor="note" className="mb-2 block font-semibold text-brand-navy">
          Additional notes <span className="font-normal text-brand-muted">(optional)</span>
        </label>
        <textarea
          id="note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={4}
          maxLength={500}
          placeholder="Briefly describe the care needed. Please do not include detailed medical information."
          className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-navy transition-colors focus:border-brand-blue focus:outline-none"
        />
        <p className="mt-1 text-xs text-brand-muted">
          Do not include detailed medical information. {form.note.length}/500 characters.
        </p>
      </div>
      <label className="flex cursor-pointer items-start gap-3">
        <span
          onClick={() => setForm({ ...form, consent: !form.consent })}
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            form.consent
              ? "border-brand-blue bg-brand-blue"
              : errors.consent
              ? "border-red-400"
              : "border-brand-border"
          }`}
          role="checkbox"
          aria-checked={form.consent}
          tabIndex={0}
          onKeyDown={(e) => e.key === " " && setForm({ ...form, consent: !form.consent })}
        >
          {form.consent && <Check size={12} className="text-white" strokeWidth={3} />}
        </span>
        <span className="text-sm text-brand-muted">
          I understand this is an appointment <strong>request</strong> that the
          Graceland team will confirm within one business day. I consent to being
          contacted about my request.{" "}
          <FieldError msg={errors.consent} />
        </span>
      </label>
    </div>
  );
}

function Step4({ form }: { form: FormState }) {
  const apptLabel = { phone: "Free phone consultation", home: "Home visit assessment" }[
    form.appointmentType
  ];
  const careForLabel = {
    myself: "Myself",
    family: "A family member",
    client: "A client I support",
  }[form.careFor as string];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-blue text-white"
      >
        <Check size={36} strokeWidth={2.5} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 font-display text-3xl font-medium text-brand-navy"
      >
        Request received
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-brand-muted"
      >
        Thank you. We have received your request and will confirm your appointment
        within one business day.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mx-auto mt-8 max-w-sm rounded-2xl bg-soft p-6 text-left text-sm"
      >
        <p className="font-semibold text-brand-navy">Your request summary</p>
        <dl className="mt-4 space-y-2">
          {[
            ["Care for", careForLabel],
            ["Funding", form.funding],
            ["Appointment", apptLabel],
            ["Date", form.preferredDate],
            ["Time", form.timeWindow],
            ["Name", form.fullName],
            ["Phone", form.phone],
            ["Email", form.email],
            ["Suburb", form.suburb],
          ].map(([k, v]) =>
            v ? (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-brand-muted">{k}</dt>
                <dd className="text-right font-medium text-brand-navy">{v}</dd>
              </div>
            ) : null
          )}
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      >
        <Link
          to="/"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand-blue px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Back to home
        </Link>
        <a
          href="https://wa.me/61450698303"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </motion.div>
    </div>
  );
}

// ─── Main booking page ────────────────────────────────────────────────────────
function BookPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Step3Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const TOTAL = 4;

  function validateStep(s: number): boolean {
    if (s === 1) return !!form.careFor && !!form.funding;
    if (s === 2) return !!form.appointmentType && !!form.preferredDate && !!form.timeWindow;
    if (s === 3) {
      const e: Step3Errors = {};
      if (!form.fullName.trim()) e.fullName = "Please enter your full name.";
      if (!form.phone.trim()) e.phone = "Please enter a phone number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
      if (!form.suburb.trim()) e.suburb = "Please enter your suburb.";
      if (!form.consent) e.consent = "Please tick the box to give your consent.";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  }

  async function handleNext() {
    if (!validateStep(step)) return;
    if (step === 3) {
      setSubmitting(true);
      setServerError("");
      try {
        await sendBookingRequest({
          data: {
            careFor: form.careFor as BookingData["careFor"],
            funding: form.funding as BookingData["funding"],
            appointmentType: form.appointmentType as BookingData["appointmentType"],
            preferredDate: form.preferredDate,
            timeWindow: form.timeWindow as BookingData["timeWindow"],
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            suburb: form.suburb,
            note: form.note || undefined,
            consent: true,
          },
        });
        setStep(4);
      } catch (err) {
        setServerError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please call us on 0450 698 303."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => s + 1);
  }

  const stepLabels = [
    "Who needs care",
    "Appointment details",
    "Your contact details",
    "Confirmed",
  ];

  const stepCanAdvance = validateStep(step) && !submitting;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="bg-brand-navy px-4 pb-16 pt-10 text-white sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ChevronLeft size={16} /> Back to home
          </Link>
          <img src={logoSvg} alt="Graceland Integrated Care" className="mb-8 h-10 w-auto" />
          <h1 className="font-display text-4xl font-medium leading-tight sm:text-5xl">
            Book your appointment
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Choose a time that suits you. A member of our team will confirm within
            one business day.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-auto -mt-8 max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-10">
          {step < 4 && (
            <>
              {/* Progress bar */}
              <div className="mb-8">
                <div className="mb-3 flex justify-between text-xs font-semibold text-brand-muted">
                  <span>
                    Step {step} of {TOTAL - 1}
                  </span>
                  <span>{stepLabels[step - 1]}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft">
                  <motion.div
                    className="h-full rounded-full bg-brand-orange"
                    animate={{ width: `${(step / (TOTAL - 1)) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  {Array.from({ length: TOTAL - 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        i + 1 <= step ? "bg-brand-blue" : "bg-brand-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="mb-8 font-display text-2xl font-medium text-brand-navy">
                {stepLabels[step - 1]}
              </h2>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 1 && <Step1 form={form} setForm={setForm} />}
              {step === 2 && <Step2 form={form} setForm={setForm} />}
              {step === 3 && (
                <Step3 form={form} setForm={setForm} errors={errors} />
              )}
              {step === 4 && <Step4 form={form} />}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-navy transition-colors hover:bg-soft disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>

              <div className="flex flex-col items-end gap-2">
                {serverError && (
                  <p className="text-right text-sm text-red-600">{serverError}</p>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!stepCanAdvance}
                  className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-brand-blue px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    "Sending…"
                  ) : step === 3 ? (
                    <>Submit request <ArrowRight size={16} /></>
                  ) : (
                    <>Continue <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact alternatives */}
        {step < 4 && (
          <div className="mt-8 rounded-2xl bg-soft p-6 sm:p-8">
            <p className="font-semibold text-brand-navy">Prefer to get in touch directly?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="tel:0450698303"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white"
              >
                <Phone size={16} /> 0450 698 303
              </a>
              <a
                href="mailto:info@gracelandintegratedcare.com.au"
                className="inline-flex min-h-[44px] items-center rounded-full border border-brand-border bg-white px-5 text-sm font-semibold text-brand-navy"
              >
                Email our team
              </a>
              <a
                href="https://wa.me/61450698303"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
