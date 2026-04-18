import styles from "./HowItWorks.module.css";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Browse the fleet",
    description:
      "Filter by model, price, or vibe. Every car is photographed, rated, and ready — no surprises at pickup.",
    detail: "500+ vehicles available",
  },
  {
    number: "02",
    title: "Book in seconds",
    description:
      "Choose your dates, confirm your pick-up point, and you're done. No paperwork, no phone calls, no waiting.",
    detail: "Instant confirmation",
  },
  {
    number: "03",
    title: "Just drive",
    description:
      "Keys are waiting. Insurance included. Full support on call. All you bring is the playlist.",
    detail: "24/7 roadside support",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div
        className={`${styles.eyebrow} ${isVisible ? styles.visible : ""}`}
        style={{ transitionDelay: "0ms" }}
      >
        <span className={styles.eyebrowDash} />
        <span className={styles.eyebrowText}>How it works</span>
      </div>

      <span
        className={`${styles.heading} ${isVisible ? styles.visible : ""}`}
        style={{ transitionDelay: "80ms" }}
      >
        Three steps,
        <br />
        <span className={styles.headingAccent}>zero friction.</span>
      </span>

      <div className={styles.stepsGrid}>
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className={`${styles.step} ${isVisible ? styles.visible : ""}`}
            style={{ transitionDelay: `${160 + i * 100}ms` }}
          >
            {i <= STEPS.length - 1 && (
              <div className={styles.connector}>
                <div
                  className={`${styles.connectorLine} ${isVisible ? styles.connectorVisible : ""}`}
                  style={{ transitionDelay: `${320 + i * 100}ms` }}
                />
              </div>
            )}

            <div className={styles.stepNumber}>{step.number}</div>

            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              <span className={styles.stepDetail}>
                <span className={styles.stepDetailDot} />
                {step.detail}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`${styles.ctaRow} ${isVisible ? styles.visible : ""}`}
        style={{ transitionDelay: "520ms" }}
      >
        <button className={styles.ctaButton}>
          <span>Start browsing</span>
          <svg
            className={styles.ctaArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className={styles.ctaNote}>No account needed to browse.</p>
      </div>
    </section>
  );
}
