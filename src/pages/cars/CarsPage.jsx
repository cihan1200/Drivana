import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axiosApi from "../../api/axiosApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import styles from "./CarsPage.module.css";

const SORT_OPTIONS = [
  { value: "score_desc", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "year_desc", label: "Newest First" },
];

const STAR_COUNT = 5;

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

function CarCard({ car }) {
  return (
    <Link to={`/cars/${car._id}`} className={styles.card}>
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
            <span className={styles.cardScore}>{car.score.toFixed(1)}</span>
            <span className={styles.cardReviewCount}>
              ({car.reviews?.length ?? 0})
            </span>
          </div>
          <div className={styles.cardSpecs}>
            {car.specs?.fuelType && (
              <span className={styles.spec}>{car.specs.fuelType}</span>
            )}
            {car.specs?.seats && (
              <span className={styles.spec}>{car.specs.seats} seats</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

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

export default function CarsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupDate = searchParams.get("pickupDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const carClass = searchParams.get("carClass") || "";

  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("score_desc");
  const [page, setPage] = useState(1);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 9 };
      if (pickupLocation) params.pickupLocation = pickupLocation;
      if (pickupDate) params.pickupDate = pickupDate;
      if (returnDate) params.returnDate = returnDate;
      if (carClass) params.carClass = carClass;

      const { data } = await axiosApi.get("/cars", { params });

      let sorted = [...data.cars];
      if (sort === "score_desc") sorted.sort((a, b) => b.score - a.score);
      else if (sort === "price_asc")
        sorted.sort((a, b) => a.specs.pricePerDay - b.specs.pricePerDay);
      else if (sort === "price_desc")
        sorted.sort((a, b) => b.specs.pricePerDay - a.specs.pricePerDay);
      else if (sort === "year_desc") sorted.sort((a, b) => b.year - a.year);

      setCars(sorted);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pickupLocation, pickupDate, returnDate, carClass, sort, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    setPage(1);
  }, [pickupLocation, pickupDate, returnDate, carClass]);

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nights =
    pickupDate && returnDate
      ? Math.round(
          (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24),
        )
      : null;

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.summaryBar}>
          <div className={styles.summaryLeft}>
            <h1 className={styles.summaryTitle}>
              {loading
                ? "Searching…"
                : `${pagination?.total ?? 0} car${pagination?.total !== 1 ? "s" : ""} available`}
            </h1>
            <div className={styles.summaryChips}>
              {pickupLocation && (
                <span className={styles.chip}>
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  {pickupLocation}
                </span>
              )}
              {pickupDate && returnDate && (
                <span className={styles.chip}>
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                  </svg>
                  {formatDate(pickupDate)} → {formatDate(returnDate)}
                  {nights != null &&
                    ` · ${nights} night${nights !== 1 ? "s" : ""}`}
                </span>
              )}
              {carClass && (
                <span className={`${styles.chip} ${styles.chipAccent}`}>
                  {carClass}
                </span>
              )}
            </div>
          </div>

          <div className={styles.summaryRight}>
            <label className={styles.sortLabel}>Sort by</label>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error ? (
          <div className={styles.stateBox}>
            <span className={styles.stateIcon}>⚠️</span>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={fetchCars}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className={styles.stateBox}>
            <span className={styles.stateIcon}>🔍</span>
            <h2>No cars found</h2>
            <p>Try adjusting your dates, location, or car class.</p>
            <button className={styles.retryBtn} onClick={() => navigate("/")}>
              Modify search
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
