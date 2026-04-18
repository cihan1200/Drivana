import styles from "./Hero.module.css";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const ADJUNCTS = ["freedom", "trust", "comfort", "ease"];
  const CAR_DATA = [
    {
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200&auto=format&fit=crop",
      model: "Mercedes-AMG GT",
      year: "2024",
      price: "$118,900",
      tag: "Sport",
    },
    {
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
      model: "Porsche 911 Carrera",
      year: "2023",
      price: "$114,400",
      tag: "Classic",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      model: "Audi R8 V10",
      year: "2024",
      price: "$158,600",
      tag: "Exotic",
    },
  ];

  const currentWord = ADJUNCTS[currentIndex];

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADJUNCTS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      goToNext();
    }, 3000);
    return () => clearInterval(id);
  }, [isPaused, currentCarIndex]);

  const goToNext = () => {
    setCurrentCarIndex((prev) => (prev + 1) % CAR_DATA.length);
    setProgressKey((prev) => prev + 1);
  };

  const goToPrev = () => {
    setCurrentCarIndex(
      (prev) => (prev - 1 + CAR_DATA.length) % CAR_DATA.length,
    );
    setProgressKey((prev) => prev + 1);
  };

  const goToIndex = (i) => {
    setCurrentCarIndex(i);
    setProgressKey((prev) => prev + 1);
  };

  const padded = (n) => String(n + 1).padStart(2, "0");

  return (
    <div className={styles.hero}>
      <div className={styles.sloganContainer}>
        <span className={styles.slogan}>
          Drive your car with
          <br />
          <span className={styles.adjunctWrapper}>
            <i key={currentIndex} className={styles.adjunctText}>
              {currentWord.split("").map((char, index) => (
                <span
                  key={index}
                  className={styles.letter}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {char}
                </span>
              ))}
            </i>
          </span>
        </span>
      </div>

      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {CAR_DATA.map((car, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentCarIndex ? styles.active : ""}`}
            >
              <img
                src={car.image}
                alt={car.model}
                className={styles.carImage}
                fetchpriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className={styles.carOverlay}>
                <div className={styles.carTag}>{car.tag}</div>
                <div className={styles.carInfo}>
                  <div className={styles.carMeta}>
                    <span className={styles.carModel}>{car.model}</span>
                    <span className={styles.carYear}>{car.year}</span>
                  </div>
                  <span className={styles.carPrice}>{car.price}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            className={`${styles.navArrow} ${styles.navPrev}`}
            onClick={goToPrev}
            aria-label="Previous"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`${styles.navArrow} ${styles.navNext}`}
            onClick={goToNext}
            aria-label="Next"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.slideCounter}>
            <span className={styles.counterCurrent}>
              {padded(currentCarIndex)}
            </span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>
              {padded(CAR_DATA.length - 1)}
            </span>
          </div>
        </div>

        <div className={styles.progressTrack}>
          {CAR_DATA.map((_, index) => (
            <button
              key={index}
              className={styles.progressSegment}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`${styles.progressFill} ${
                  index === currentCarIndex ? styles.progressActive : ""
                } ${index < currentCarIndex ? styles.progressDone : ""}`}
                key={index === currentCarIndex ? progressKey : index}
                style={{ animationPlayState: isPaused ? "paused" : "running" }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
