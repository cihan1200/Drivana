import styles from "./HomePage.module.css";
import Header from "../../components/header/Header";
import Hero from "./Hero";
import FeaturedFleet from "./FeaturedFleet";
import Footer from "../../components/footer/Footer";

export default function HomePage() {
  return (
    <>
      <div className={styles.homePage}>
        <Header />
        <Hero />
        <FeaturedFleet />
        <Footer />
      </div>
    </>
  );
}
