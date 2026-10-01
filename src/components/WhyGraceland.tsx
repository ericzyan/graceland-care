import { useEffect, useRef, useState } from "react";
import { Check, Heart, House, MessageCircle, Plus, Stethoscope } from "lucide-react";
import "./why-graceland.css";

const benefits = [
  {
    title: "Care where you feel at home",
    text: "Community nursing in the comfort of your own home, close to the people you love.",
    visual: "home",
  },
  {
    title: "Your needs. Your care plan.",
    text: "Thoughtful, personalised support that adapts as your health and daily needs change.",
    visual: "plan",
  },
  {
    title: "Support without the stress",
    text: "Clear guidance for DVA, NDIS and aged care, with a team to help you take the next step.",
    visual: "support",
  },
];

export default function WhyGraceland() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [headingEntered, setHeadingEntered] = useState<boolean | null>(null);

  // Replay from either scroll direction; reset only after fully leaving the viewport.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) setHeadingEntered(false);
        else if (entry.intersectionRatio >= 0.2) setHeadingEntered(true);
      },
      { threshold: [0, 0.2] },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-graceland py-24" aria-labelledby="why-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          data-entered={headingEntered ?? undefined}
          id="why-heading"
          className="why-heading font-display text-4xl font-medium sm:text-5xl"
        >
          <span className="why-heading-intro">Why families choose</span>{" "}
          <span className="why-heading-name">
            <span>Graceland.</span>
          </span>
        </h2>
        <div className="why-cards">
          {benefits.map(({ title, text, visual }) => (
            <article key={visual} className="why-card" tabIndex={0}>
              {/* Lightweight decorative illustrations use the existing brand palette. */}
              <div className={`why-visual why-visual-${visual}`} aria-hidden="true">
                {visual === "home" && (
                  <>
                    <span className="why-home-halo" />
                    <div className="why-home-symbol">
                      <House strokeWidth={1.5} />
                      <Heart className="why-home-heart" />
                    </div>
                    <span className="why-small-plus">
                      <Plus size={22} />
                    </span>
                  </>
                )}
                {visual === "plan" && (
                  <>
                    <div className="why-plan-sheet">
                      <span className="why-plan-top">
                        <Heart size={21} />
                        <span />
                      </span>
                      {[0, 1, 2].map((row) => (
                        <span className="why-plan-row" key={row}>
                          <Check size={15} />
                          <span />
                        </span>
                      ))}
                    </div>
                    <div className="why-plan-badge">
                      <Stethoscope size={38} strokeWidth={1.5} />
                    </div>
                  </>
                )}
                {visual === "support" && (
                  <>
                    <span className="why-support-ring" />
                    <div className="why-support-heart">
                      <Heart size={58} strokeWidth={1.5} />
                    </div>
                    <MessageCircle className="why-bubble why-bubble-one" size={35} />
                    <MessageCircle className="why-bubble why-bubble-two" size={28} />
                    <span className="why-support-plus">
                      <Plus size={23} />
                    </span>
                  </>
                )}
              </div>
              <div className="why-card-copy">
                <h3 className="font-display">{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
