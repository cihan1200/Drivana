import styles from "./Hero.module.css";
import { useState } from "react";

const CAR_CLASSES = [
  "Economy",
  "Compact",
  "Midsize",
  "Full-Size",
  "Luxury",
  "SUV",
  "Convertible",
  "Classic",
];

export default function Hero() {
  const [sameReturn, setSameReturn] = useState(true);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
    carClass: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      ...formData,
      returnLocation: sameReturn
        ? formData.pickupLocation
        : formData.returnLocation,
    });
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Premium Fleet Available</span>
          <h1 className={styles.headline}>
            Drive the <em>road</em>
            <br /> your way.
          </h1>
          <p className={styles.subtext}>
            Handpicked vehicles. Transparent pricing.
            <br /> No hidden fees.
          </p>
        </div>

        <form className={styles.rentalForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <span className={styles.formTitle}>Find your car</span>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={sameReturn}
                onChange={() => setSameReturn((v) => !v)}
              />
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              <span className={styles.toggleLabel}>
                Return to same location
              </span>
            </label>
          </div>

          <div className={styles.formGrid}>
            <div className={`${styles.field} ${styles.wide}`}>
              <label className={styles.label}>Pick-up Location</label>
              <div className={styles.inputWrap}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" />
                  <circle cx="12" cy="13" r="3" />
                  <path d="M12 3V5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  name="pickupLocation"
                  className={styles.input}
                  placeholder="City, airport or address"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {!sameReturn && (
              <div className={`${styles.field} ${styles.wide}`}>
                <label className={styles.label}>Return Location</label>
                <div className={styles.inputWrap}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" />
                    <circle cx="12" cy="13" r="3" fill="currentColor" />
                    <path d="M12 3V5" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    name="returnLocation"
                    className={styles.input}
                    placeholder="City, airport or address"
                    value={formData.returnLocation}
                    onChange={handleChange}
                    required={!sameReturn}
                  />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Pick-up Date</label>
              <div className={styles.inputWrap}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                </svg>
                <input
                  type="date"
                  name="pickupDate"
                  className={styles.input}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Return Date</label>
              <div className={styles.inputWrap}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                </svg>
                <input
                  type="date"
                  name="returnDate"
                  className={styles.input}
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Car Class</label>
              <div className={styles.inputWrap}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M5 17H3v-5l2-5h14l2 5v5h-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                  <path d="M5 12h14" strokeLinecap="round" />
                </svg>
                <select
                  name="carClass"
                  className={`${styles.input} ${styles.select}`}
                  value={formData.carClass}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Any class
                  </option>
                  {CAR_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            <span>Search Available Cars</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className={styles.arrow}
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
