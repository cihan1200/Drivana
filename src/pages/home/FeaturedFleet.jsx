import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FeaturedFleet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axiosApi from "../../api/axiosApi";

const ITEMS_PER_PAGE = 12;

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = new Set([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) items.add(currentPage - 1);
  if (currentPage + 1 < totalPages) items.add(currentPage + 1);

  const sorted = [...items].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);
    const next = sorted[i + 1];
    if (next !== undefined && next - sorted[i] > 1) {
      result.push("...");
    }
  }

  return result;
}

export default function FeaturedFleet() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fleetRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosApi.get("/cars", {
          params: { page: currentPage, limit: ITEMS_PER_PAGE },
        });
        setCars(data.cars);
        setTotalPages(data.pagination.totalPages);
        setTotalCars(data.pagination.total);
      } catch (err) {
        setError("Failed to load cars. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    if (fleetRef.current) {
      const offset = -70;
      const elementPosition = fleetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className={styles.featuredFleet} ref={fleetRef}>
      <div className={styles.header}>
        <span className={styles.title}>Featured Fleet</span>
        {!loading && !error && (
          <span className={styles.pageIndicator}>
            {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalCars)}{" "}
            of {totalCars} cars
          </span>
        )}
      </div>

      {loading && (
        <div className={styles.stateContainer}>
          <div className={styles.spinner} />
        </div>
      )}

      {!loading && error && (
        <div className={styles.stateContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => setCurrentPage(currentPage)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={styles.cardsContainer}>
            {cars.map((car) => (
              <div
                className={styles.card}
                key={car._id}
                onClick={() => navigate(`/cars/${car._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/cars/${car._id}`);
                  }
                }}
                aria-label={`View details for ${car.name}`}
              >
                <img
                  className={styles.carImage}
                  src={car.image}
                  alt={`${car.name} image`}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${car._id}/1000`;
                    e.currentTarget.onerror = null;
                  }}
                />
                <span className={styles.carName}>{car.name}</span>
                <div className={styles.carYearAndScore}>
                  <span>{car.year}</span>•
                  <span>
                    {car.score}{" "}
                    <FontAwesomeIcon
                      className={styles.starIcon}
                      icon={faStar}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.paginationArrow}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className={styles.paginationItems}>
              {pageItems.map((item, index) =>
                item === "..." ? (
                  <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    className={`${styles.pageNumber} ${
                      item === currentPage ? styles.pageNumberActive : ""
                    }`}
                    onClick={() => goToPage(item)}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            <button
              className={styles.paginationArrow}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
