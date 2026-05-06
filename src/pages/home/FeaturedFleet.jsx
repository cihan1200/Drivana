import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./FeaturedFleet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axiosApi from "../../api/axiosApi";

const ITEMS_PER_PAGE = 12;
const STAR_COUNT = 5;

// Exact StarRating from CarsPage
function StarRating({ score }) {
  return (
    <span className={styles.stars} aria-label={`${score} out of 5`}>
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const fill = Math.min(1, Math.max(0, score - i));
        return (
          <span key={i} className={styles.star}>
            <svg viewBox="0 0 24 24" width="13" height="13">
              <defs>
                <linearGradient id={`g${i}-${Math.round(score * 10)}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#ffbb5c" />
                  <stop offset={`${fill * 100}%`} stopColor="#e0e0e0" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={`url(#g${i}-${Math.round(score * 10)})`}
              />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

// Exact SkeletonCard from CarsPage
function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: "40%" }} />
        <div className={styles.skeletonLine} style={{ width: "70%" }} />
        <div className={styles.skeletonLine} style={{ width: "55%" }} />
      </div>
    </div>
  );
}

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
        <div className={styles.cardsContainer}>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
              <Link
                to={`/cars/${car._id}`}
                className={styles.card}
                key={car._id}
              >
                <div className={styles.cardImageWrap}>
                  <img
                    src={car.image}
                    alt={car.name}
                    className={styles.cardImage}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${car._id}/1000`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <span className={styles.cardClass}>{car.specs?.class}</span>
                  <span className={styles.cardPrice}>
                    <strong>${car.specs?.pricePerDay}</strong>
                    <small>/day</small>
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardYear}>{car.year}</span>
                    <span className={styles.cardLocation}>
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="10" r="3" />
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      {car.location}
                    </span>
                  </div>
                  <h3 className={styles.cardName}>{car.name}</h3>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardRating}>
                      <StarRating score={car.score} />
                      <span className={styles.cardScore}>
                        {car.score.toFixed(1)}
                      </span>
                      <span className={styles.cardReviewCount}>
                        ({car.reviews?.length ?? 0})
                      </span>
                    </div>
                    <div className={styles.cardSpecs}>
                      {car.specs?.fuelType && (
                        <span className={styles.spec}>
                          {car.specs.fuelType}
                        </span>
                      )}
                      {car.specs?.seats && (
                        <span className={styles.spec}>
                          {car.specs.seats} seats
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            {/* Pagination buttons remain unchanged */}
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
