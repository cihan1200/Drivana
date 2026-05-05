import styles from "./ServerWakeup.module.css";

export default function ServerWakeUp() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <h2 className={styles.title}>Waking up the engine...</h2>
      <p className={styles.subtitle}>
        Please hang tight for just a moment. We use a free hosting service, so
        the server occasionally needs a few seconds to warm up from sleep mode!
      </p>
    </div>
  );
}
