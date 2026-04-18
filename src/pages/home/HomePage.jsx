import styles from "./HomePage.module.css";
import Header from "../../components/header/Header";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";

export default function HomePage() {
  return (
    <>
      <div className={styles.homePage}>
        <Header />
        <Hero />
        <HowItWorks />
      </div>
    </>
  );
}
