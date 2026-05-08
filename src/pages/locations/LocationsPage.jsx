import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import styles from "./LocationsPage.module.css";
import { useEffect } from "react";

const LOCATIONS = [
  {
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Los Angeles",
    image:
      "https://images.unsplash.com/photo-1580659328221-39634e9eaf27?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chicago",
    image:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Miami",
    image:
      "https://images.unsplash.com/photo-1533682805518-48d1f298c7ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "San Francisco",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Las Vegas",
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dallas",
    image:
      "https://images.unsplash.com/photo-1542838686-37ed7a7833bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Boston",
    image:
      "https://images.unsplash.com/photo-1506501139174-099022df5220?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Seattle",
    image:
      "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Atlanta",
    image:
      "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Denver",
    image:
      "https://images.unsplash.com/photo-1634507307799-aec9b55239e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Orlando",
    image:
      "https://images.unsplash.com/photo-1597466599360-1563f45dc246?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Phoenix",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Austin",
    image:
      "https://images.unsplash.com/photo-1531218150217-5afc46b55615?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Nashville",
    image:
      "https://images.unsplash.com/photo-1606775179262-6c17eb7422f6?auto=format&fit=crop&w=800&q=80",
  },
];

export default function LocationsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLocationClick = (city) => {
    navigate(`/cars?pickupLocation=${encodeURIComponent(city)}`);
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.hero}>
            <span className={styles.eyebrow}>Global Reach</span>
            <h1 className={styles.title}>Our Locations</h1>
            <p className={styles.subtitle}>
              Find the perfect premium vehicle in a city near you. Select a
              destination to browse our exclusive fleet.
            </p>
          </div>

          <div className={styles.grid}>
            {LOCATIONS.map((loc, i) => (
              <div
                key={loc.name}
                className={styles.card}
                onClick={() => handleLocationClick(loc.name)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.imageWrap}>
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className={styles.image}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${loc.name}/800/1000`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div className={styles.overlay} />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <div className={styles.locationTag}>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className={styles.pinIcon}
                      />
                      United States
                    </div>
                    <h2 className={styles.cityName}>{loc.name}</h2>
                  </div>
                  <div className={styles.actionBtn}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
