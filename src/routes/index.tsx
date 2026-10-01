"use client";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  HeartHandshake,
  House,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  X,
  ChevronUp,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import coverImage from "@/assets/cover.jpg";
import welcomeCare from "@/assets/welcome-care.jpg";
import homeCareDetails from "@/assets/home-care-details.jpg";
import familyGuidance from "@/assets/family-guidance.jpg";
import logoSvg from "@/assets/Logo-02.svg";

// ─── Route ────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Graceland Integrated Care | Community Nursing in Brisbane" },
      {
        name: "description",
        content:
          "DVA, NDIS and Aged Care community nursing at home in Brisbane. Integrated care for every chapter of life. Call 0450 698 303.",
      },
      { property: "og:title", content: "Graceland Integrated Care | Community Nursing in Brisbane" },
      {
        property: "og:description",
        content:
          "DVA, NDIS and Aged Care community nursing at home in Brisbane. Integrated care for every chapter of life.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Graceland Integrated Care",
          legalName: "Graceland Healthcare Group Pty Ltd",
          telephone: "+61450698303",
          email: "info@gracelandintegratedcare.com.au",
          areaServed: "Brisbane, Queensland",
        }),
      },
    ],
  }),
  component: HomePage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const services = [
  {
    num: "01",
    key: "DVA",
    title: "DVA Community Nursing",
    audience: "For eligible veterans, war widows and widowers",
    icon: ShieldCheck,
    image: welcomeCare,
    imageAlt: "Community nurse arriving at an older person's home",
    direction: "left" as const,
    items: ["Wound care", "Medication management", "Post-hospital support", "Palliative care"],
  },
  {
    num: "02",
    key: "NDIS",
    title: "NDIS Community Nursing",
    audience: "For NDIS participants at home or in the community",
    icon: HeartHandshake,
    image: homeCareDetails,
    imageAlt: "Community nurse preparing home health monitoring equipment",
    direction: "right" as const,
    items: ["Complex care needs", "Behaviour support", "Health assessments", "Skill building"],
  },
  {
    num: "03",
    key: "Aged Care",
    title: "Aged Care Community Nursing",
    audience: "For older Australians living at home",
    icon: House,
    image: familyGuidance,
    imageAlt: "Older woman and family member speaking with a community nurse at home",
    direction: "left" as const,
    items: ["Chronic disease management", "Continence care", "Allied health coordination", "Carer support"],
  },
] as const;

const approach = [
  ["Care at home", "Treatment in your own space, with fewer trips to hospital."],
  ["Early detection", "Regular visits catch small changes before they become emergencies."],
  ["Family guidance", "We show carers the routines and safety steps that make daily life easier."],
  ["Continuity", "If your funding changes, your care team can stay familiar."],
];

const howItWorks = [
  { num: "01", title: "Tell us what you need", text: "Call, email or complete the online form. Tell us who needs care and which funding they hold." },
  { num: "02", title: "We plan your care", text: "Our nurses review your needs and design a personalised care plan — no obligation, no pressure." },
  { num: "03", title: "We care at home", text: "Your dedicated care team begins visits at times that suit you. We review and adjust as your needs change." },
];

const marqueeItems = ["DVA", "NDIS", "Aged Care", "Wound Care", "Palliative Care", "Medication Support", "Post-Hospital Care", "Continence Care", "Allied Health"];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28, transition: { duration: 0.25, ease: "easeIn" } },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const slideFrom = (dir: "left" | "right") => ({
  hidden: {
    opacity: 0,
    x: dir === "left" ? -60 : 60,
    transition: { duration: 0.25, ease: "easeIn" },
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay },
  }),
});

// ─── Lenis smooth scroll ──────────────────────────────────────────────────────
function useLenis(reduced: boolean) {
  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    let lenis: import("lenis").default | null = null;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      let rafId: number;
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
      return () => {
        cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    });
    return () => { lenis?.destroy(); };
  }, [reduced]);
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function SiteLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { onDone(); return; }
    const t = setTimeout(onDone, 950);
    return () => clearTimeout(t);
  }, [reduced, onDone]);

  if (reduced) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-navy"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="flex items-center gap-3.5" aria-label="Loading Graceland Integrated Care" role="status">
        {[
          "bg-brand-blue",
          "bg-white border-2 border-brand-orange",
          "bg-brand-orange",
        ].map((cls, i) => (
          <motion.span
            key={i}
            className={`block size-4 rounded-full ${cls}`}
            initial={{ opacity: 0.3, scale: 0.8, y: 4 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.15, 0.8],
              y: [0, -6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.0,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Scroll-progress bar ─────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="scroll-progress pointer-events-none"
      style={{ scaleX, width: "100%" }}
      aria-hidden="true"
    />
  );
}

// ─── Back-to-top ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-4 z-50 grid size-12 place-items-center rounded-full bg-brand-navy text-white shadow-lg sm:right-6"
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── WhatsApp floating button ─────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/61450698303"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-50 flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 sm:right-6"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ loaded }: { loaded: boolean }) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Slow smooth continuous transformation into liquid glass as the user scrolls
  const bg = useTransform(
    scrollY,
    [0, 280],
    ["rgba(255, 255, 255, 0.96)", "rgba(255, 255, 255, 0.62)"]
  );
  const borderColor = useTransform(
    scrollY,
    [0, 280],
    ["rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.70)"]
  );
  const shadow = useTransform(
    scrollY,
    [0, 280],
    [
      "0 2px 12px rgba(0, 0, 0, 0.05)",
      "0 14px 40px -4px rgba(4, 42, 127, 0.14)"
    ]
  );
  const glassSheenOpacity = useTransform(scrollY, [0, 280], [0, 1]);
  const paddingY = useTransform(scrollY, [0, 280], ["0.75rem", "0.55rem"]);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#who-we-are", label: "About" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <ScrollProgressBar />
      <header className="fixed inset-x-0 top-3 sm:top-5 z-40 px-3 sm:px-6 lg:px-8 pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={loaded ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{
            backgroundColor: bg,
            borderColor: borderColor,
            boxShadow: shadow,
            paddingTop: paddingY,
            paddingBottom: paddingY,
          }}
          className="relative pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border px-4 sm:px-6 backdrop-blur-xl backdrop-saturate-150"
        >
          {/* Liquid glass specular highlight reflection layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              opacity: glassSheenOpacity,
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.15) 35%, rgba(255, 255, 255, 0) 100%)",
              boxShadow:
                "inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(4, 42, 127, 0.08)",
            }}
            aria-hidden="true"
          />

          {/* Logo */}
          <a
            href="#top"
            className="relative z-10 flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.01]"
            aria-label="Graceland Integrated Care home"
            onClick={() => setOpen(false)}
          >
            <img src={logoSvg} alt="Graceland Integrated Care logo" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="truncate text-sm font-semibold tracking-tight text-brand-navy sm:text-base">
              Graceland Integrated Care
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            className="relative z-10 hidden items-center gap-7 text-sm font-semibold text-brand-navy md:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative text-brand-navy transition-colors duration-200 hover:text-brand-blue after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-brand-blue after:transition-all after:duration-200 hover:after:w-full"
              >
                {label}
              </a>
            ))}
            <Link
              to="/book"
              className="inline-flex min-h-[42px] items-center rounded-full bg-brand-orange px-5 text-sm font-semibold text-brand-navy shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:brightness-105"
            >
              Book an appointment
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 grid size-10 place-items-center rounded-full bg-brand-navy text-white transition-transform hover:scale-105 active:scale-95 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-black/[0.06] bg-white/98 p-4 shadow-xl backdrop-blur-lg md:hidden"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center rounded-2xl px-4 text-base font-semibold text-brand-navy hover:bg-slate-100"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <Link
                  to="/book"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[46px] items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-brand-navy shadow-sm transition-transform active:scale-98"
                >
                  Book an appointment
                </Link>
                <a
                  href="tel:0450698303"
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-medium text-brand-navy hover:bg-slate-50"
                >
                  <Phone size={16} /> 0450 698 303
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const Comp = motion[Tag as keyof typeof motion] as typeof motion.div;

  return (
    <Comp
      ref={ref as any}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      custom={delay}
    >
      {children}
    </Comp>
  );
}

// ─── Service bar ──────────────────────────────────────────────────────────────
function ServiceBar({
  num,
  title,
  audience,
  icon: Icon,
  image,
  imageAlt,
  items,
  direction,
}: (typeof services)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const barVariants = slideFrom(direction);

  return (
    <motion.div
      ref={ref}
      variants={barVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      custom={0}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-brand-border sm:flex-row"
    >
      {/* Image */}
      <div className="relative h-52 shrink-0 overflow-hidden sm:h-auto sm:w-64 lg:w-80">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={640}
          height={480}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-brand-navy/30" />
      </div>

      {/* Content */}
      <motion.div
        className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10"
        variants={fadeUp}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        custom={0.25}
      >
        <div>
          <span className="font-mono text-xs font-semibold text-brand-orange">
            {num} — {title.split(" ")[0]}
          </span>
          <h3 className="mt-2 font-display text-2xl font-medium sm:text-3xl">{title}</h3>
          <p className="mt-2 text-sm text-brand-muted">{audience}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-brand-orange" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-brand-blue text-white">
            <Icon size={20} />
          </span>
          <Link
            to="/book"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-soft px-5 text-sm font-semibold text-brand-navy transition-all hover:bg-brand-blue hover:text-white"
          >
            Book a consultation <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div
      className="overflow-hidden border-y border-brand-border bg-soft py-5"
      aria-label="Services offered"
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 shrink-0 font-display text-base font-medium text-brand-navy"
          >
            {item}
            <span className="ml-8 text-brand-orange" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Key facts row ────────────────────────────────────────────────────────────
function KeyFacts() {
  const facts = [
    { value: "[TO CONFIRM]", label: "Years of nursing experience" },
    { value: "3", label: "Funding streams supported" },
    { value: "Brisbane", label: "Service area, QLD" },
    { value: "24 h", label: "Referral response target" },
  ];
  return (
    <div className="mt-16 grid gap-4 border-y border-brand-border py-10 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map(({ value, label }) => (
        <Reveal key={label}>
          <strong className="font-display text-3xl font-semibold text-brand-blue">
            {value}
          </strong>
          <p className="mt-1 text-sm text-brand-muted">{label}</p>
        </Reveal>
      ))}
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const reduced = useReducedMotion();

  useLenis(reduced);

  const handleLoaderDone = useCallback(() => {
    setShowLoader(false);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShowLoader(false);
      setLoaded(true);
    }
  }, [reduced]);

  const { scrollY } = useScroll();
  const heroBgScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  return (
    <div id="top" className="overflow-hidden bg-background">
      {/* Loader */}
      <AnimatePresence>{showLoader && <SiteLoader onDone={handleLoaderDone} />}</AnimatePresence>

      <Header loaded={loaded} />
      <WhatsAppButton />
      <BackToTop />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[100svh] flex-col items-start justify-center overflow-hidden bg-brand-navy px-5 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:px-16 lg:pt-40 lg:pb-24"
        aria-label="Graceland Integrated Care — hero"
      >
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={reduced ? {} : { scale: heroBgScale }}
        >
          <img
            src={coverImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-[60%_center]"
          />
          <div className="absolute inset-0 cover-blue-gradient" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl">

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium leading-[1.04] text-white max-w-4xl tracking-tight">
            {["Integrated Care", "for Every Chapter", "of Life"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={fadeUp}
                  initial="hidden"
                  animate={loaded ? "visible" : "hidden"}
                  custom={0.25 + i * 0.12}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed text-white/90"
            variants={fadeUp}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
            custom={0.6}
          >
            DVA, NDIS and Aged Care nursing at home — the same dedicated clinical team,
            the same standard of care, whatever your funding.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            variants={fadeUp}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
            custom={0.75}
          >
            <Link
              to="/book"
              className="inline-flex min-h-[52px] sm:min-h-[56px] items-center gap-3 rounded-full bg-brand-orange px-8 text-base sm:text-lg font-semibold text-brand-navy shadow-lg shadow-brand-orange/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
            >
              Book an appointment <ArrowRight size={20} />
            </Link>
            <a
              href="#contact"
              className="inline-flex min-h-[52px] sm:min-h-[56px] items-center gap-2.5 rounded-full border border-white/30 bg-white/5 px-7 text-base sm:text-lg font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/15"
            >
              <Phone size={19} /> 0450 698 303
            </a>
          </motion.div>


        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── WHO WE ARE ──────────────────────────────────────────────────────── */}
      <section id="who-we-are" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="flex min-h-80 flex-col justify-between rounded-[1.75rem] bg-soft p-8">
            <span className="font-mono text-xs font-semibold uppercase text-brand-muted">
              Who we are
            </span>
            <div>
              <Stethoscope className="mb-4 text-brand-blue" size={28} />
              <h2 className="font-display text-2xl font-medium sm:text-3xl">
                Nurses and care workers providing integrated community nursing.
              </h2>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative flex min-h-80 overflow-hidden rounded-[1.75rem] bg-brand-orange p-8"
          >
            <div className="relative z-10 max-w-xs self-end">
              <span className="font-mono text-xs font-semibold uppercase text-brand-navy">
                Our promise
              </span>
              <h2 className="mt-3 font-display text-2xl font-medium text-brand-navy sm:text-3xl">
                Care at home, for every chapter of life.
              </h2>
            </div>
            <div className="absolute -right-16 -top-12 size-72 rounded-full border-[50px] border-brand-navy/20" />
          </Reveal>

          <Reveal delay={0.2} className="group relative min-h-80 overflow-hidden rounded-[1.75rem]">
            <img
              src={welcomeCare}
              alt="A community nurse warmly welcomed at the door of an older person's home"
              loading="lazy"
              width={640}
              height={480}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy to-transparent p-7 pt-20 text-white">
              <span className="font-mono text-xs font-semibold uppercase">A warm welcome</span>
              <h2 className="mt-2 font-display text-2xl font-medium">Care begins with listening.</h2>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="bg-soft py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold uppercase text-brand-muted">
              Our services
            </span>
            <h2 className="mt-6 font-display text-4xl font-medium sm:text-5xl">
              Three services,
              <br />
              one standard of care
            </h2>
            <p className="mt-5 text-brand-muted">
              Whichever funding you hold, you get the same nurses, the same
              attention to detail, and the comfort of being cared for at home.
            </p>
          </Reveal>

          <div className="mt-14 flex flex-col gap-6">
            {services.map((s) => (
              <ServiceBar key={s.key} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase text-brand-muted">
            How it works
          </span>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-medium sm:text-5xl">
            Getting started is simple
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {howItWorks.map(({ num, title, text }, i) => (
            <Reveal key={num} delay={i * 0.1} className="rounded-[1.75rem] bg-soft p-8">
              <span className="font-mono text-4xl font-semibold text-brand-orange">{num}</span>
              <h3 className="mt-4 font-display text-xl font-medium">{title}</h3>
              <p className="mt-3 text-sm text-brand-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY GRACELAND ───────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <span className="font-mono text-xs font-semibold uppercase text-white/60">
                Why Graceland
              </span>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
                Why families choose an integrated approach
              </h2>
              <p className="mt-5 text-white/70">
                Care needs change. Our three services sit under one roof so you
                never have to start again.
              </p>
              <div className="mt-8">
                <Link
                  to="/book"
                  className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-brand-orange px-6 text-base font-semibold text-brand-navy transition-transform hover:-translate-y-0.5"
                >
                  Book an appointment <ArrowRight size={18} />
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-4 md:grid-cols-2">
              {approach.map(([title, text], i) => (
                <Reveal
                  key={title as string}
                  delay={i * 0.1}
                  className="rounded-2xl border border-white/10 border-t-4 border-t-brand-orange bg-white/5 p-6"
                >
                  <span className="font-mono text-xl font-semibold text-brand-orange">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-medium">{title as string}</h3>
                  <p className="mt-2 text-sm text-white/70">{text as string}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <KeyFacts />
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase text-brand-muted">
            Family stories
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
            What families say
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[1, 2].map((n) => (
            <Reveal
              key={n}
              delay={n * 0.1}
              className="rounded-[1.75rem] bg-soft p-8 sm:p-10"
            >
              <span className="font-mono text-xs font-semibold uppercase text-brand-muted">
                Family story
              </span>
              <blockquote className="mt-8 font-display text-2xl leading-snug text-brand-navy">
                "[TESTIMONIAL TO CONFIRM WITH CLIENT]"
              </blockquote>
              <p className="mt-6 text-sm font-semibold text-brand-muted">
                [NAME AND DETAILS TO CONFIRM WITH CLIENT]
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ─────────────────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-soft lg:grid-cols-2">
          <div className="p-8 sm:p-10 lg:p-14">
            <span className="font-mono text-xs font-semibold uppercase text-brand-muted">
              Make a referral
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium sm:text-5xl">
              Talk to us about your care
            </h2>
            <p className="mt-5 max-w-md text-brand-muted">
              Tell us who needs care and what funding they have. We will call you
              back to plan the next step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-brand-orange px-6 text-sm font-semibold text-brand-navy transition-transform hover:-translate-y-0.5"
              >
                Book an appointment <ArrowRight size={16} />
              </Link>
              <a
                href="tel:0450698303"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white"
              >
                <Phone size={17} /> 0450 698 303
              </a>
              <a
                href="mailto:info@gracelandintegratedcare.com.au"
                className="inline-flex min-h-[48px] items-center rounded-full border border-brand-border bg-white px-5 text-sm font-semibold text-brand-navy"
              >
                Email our team
              </a>
            </div>
          </div>
          <div className="min-h-80 overflow-hidden lg:m-5 lg:rounded-[1.5rem]">
            <img
              src={familyGuidance}
              alt="A family speaking with a community nurse in a welcoming home"
              loading="lazy"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="px-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-[1500px] rounded-[2rem] bg-brand-navy px-6 py-12 text-white sm:px-10 lg:px-14">
          <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoSvg} alt="Graceland Integrated Care" className="h-9 w-auto" />
                <span className="font-semibold">Graceland Integrated Care</span>
              </div>
              <p className="mt-5 max-w-xs text-sm text-white/65">
                Nursing care at home for veterans, people living with disability,
                and older Australians.
              </p>
              <a
                href="https://wa.me/61450698303"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
              >
                <MessageCircle size={17} /> Chat on WhatsApp
              </a>
            </div>
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase text-white/50">
                Services
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>DVA Community Nursing</li>
                <li>NDIS Community Nursing</li>
                <li>Aged Care Nursing</li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase text-white/50">
                Contact
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <a href="tel:0450698303" className="hover:text-white">
                    0450 698 303
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@gracelandintegratedcare.com.au"
                    className="break-all hover:text-white"
                  >
                    info@gracelandintegratedcare.com.au
                  </a>
                </li>
                <li>Brisbane, Queensland</li>
              </ul>
            </div>
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase text-white/50">
                Provider details
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>ABN [TO CONFIRM]</li>
                <li>NDIS registration [TO CONFIRM]</li>
                <li>DVA provider number [TO CONFIRM]</li>
                <li>
                  <a href="#top" className="hover:text-white">
                    Privacy [LEGAL REVIEW REQUIRED]
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-xs text-white/50 sm:flex-row sm:justify-between">
            <p>
              Graceland Integrated Care is a trading name of Graceland Healthcare
              Group Pty Ltd. ABN [to confirm].
            </p>
            <p>Acknowledgement of Country [TO CONFIRM WITH CLIENT].</p>
          </div>
        </div>
      </footer>
    </div>
  );
}