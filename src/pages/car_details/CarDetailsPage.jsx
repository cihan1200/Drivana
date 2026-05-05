import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CarDetailsPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronLeft,
  faChevronRight,
  faGasPump,
  faGaugeHigh,
  faPeopleGroup,
  faSnowflake,
  faShield,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import axiosApi from "../../api/axiosApi";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const REVIEWS_PER_PAGE = 10;

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

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const thumbnailRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDraggingThumbnails, setIsDraggingThumbnails] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsRef = useRef(null);

  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupDate: "",
    returnDate: "",
  });

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      setActiveImage(0);
      setReviewPage(1);
      try {
        const { data } = await axiosApi.get(`/cars/${id}`);
        setCar(data);
      } catch (err) {
        setError("Failed to load car details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ carId: id, ...formData });
  };

  const renderStars = (score, small = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={`${small ? styles.starSmall : styles.star} ${
          i < Math.round(score) ? styles.starFilled : styles.starEmpty
        }`}
      />
    ));
  };

  const carImages =
    car?.images?.length > 0 ? car.images : car ? [car.image] : [];

  const goToImage = (index) => {
    if (index === activeImage) return;
    setImageLoaded(false);
    setActiveImage(index);
  };

  const prevImage = () => {
    setImageLoaded(false);
    setActiveImage((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  const nextImage = () => {
    setImageLoaded(false);
    setActiveImage((prev) => (prev + 1) % carImages.length);
  };

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setIsDraggingThumbnails(false);
    setStartX(e.pageX - thumbnailRef.current.offsetLeft);
    setScrollLeftPos(thumbnailRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsDraggingThumbnails(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDraggingThumbnails(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - thumbnailRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    if (Math.abs(walk) > 5) {
      setIsDraggingThumbnails(true);
    }

    thumbnailRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const reviews = car?.reviews ?? [];
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const pagedReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );
  const reviewPageItems = buildPageItems(reviewPage, totalReviewPages);

  const goToReviewPage = (page) => {
    if (page < 1 || page > totalReviewPages) return;
    setReviewPage(page);

    if (reviewsRef.current) {
      const offset = -70;
      const elementPosition = reviewsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.spinner} />
        <span className={styles.stateText}>Loading car details…</span>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className={styles.stateContainer}>
        <p className={styles.errorText}>{error || "Car not found."}</p>
        <button className={styles.retryButton} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const specs = [
    {
      icon: faGasPump,
      label: "Fuel Type",
      value: car.specs?.fuelType || "Petrol",
    },
    {
      icon: faGaugeHigh,
      label: "Engine",
      value: car.specs?.engine || "2.0L Turbo",
    },
    {
      icon: faPeopleGroup,
      label: "Seats",
      value: `${car.specs?.seats || 5} seats`,
    },
    {
      icon: faSnowflake,
      label: "A/C",
      value: car.specs?.ac !== false ? "Included" : "No A/C",
    },
  ];

  const features = car.features?.length > 0 ? car.features : [];
  const pricePerDay = car.specs?.pricePerDay;
  const carClass = car.specs?.class;
  const description = car.specs?.description;

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.heroWrap}>
          <img
            className={`${styles.heroImageBg} ${imageLoaded ? styles.heroImageVisible : ""}`}
            src={carImages[activeImage]}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${car._id}-${activeImage}/1400/700`;
              e.currentTarget.onerror = null;
            }}
          />

          <img
            className={`${styles.heroImage} ${imageLoaded ? styles.heroImageVisible : ""}`}
            src={carImages[activeImage]}
            alt={car.name}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${car._id}-${activeImage}/1400/700`;
              e.currentTarget.onerror = null;
              setImageLoaded(true);
            }}
          />
          {!imageLoaded && <div className={styles.heroSkeleton} />}

          {carImages.length > 1 && (
            <>
              <button
                className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                onClick={nextImage}
                aria-label="Next image"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              {carImages.length <= 10 && (
                <div className={styles.galleryDots}>
                  {carImages.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.galleryDot} ${i === activeImage ? styles.galleryDotActive : ""}`}
                      onClick={() => goToImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className={styles.imageCounter}>
                {activeImage + 1} / {carImages.length}
              </div>
            </>
          )}

          <div className={styles.heroBadge}>
            <FontAwesomeIcon icon={faStar} className={styles.heroBadgeStar} />
            <span>{car.score}</span>
          </div>
        </div>

        {carImages.length > 1 && (
          <div
            className={`${styles.thumbnailStrip} ${isDraggingThumbnails ? styles.isDragging : ""}`}
            ref={thumbnailRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {carImages.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumbnail} ${i === activeImage ? styles.thumbnailActive : ""}`}
                onClick={(e) => {
                  if (isDraggingThumbnails) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  goToImage(i);
                }}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={src}
                  draggable="false"
                  alt={`${car.name} view ${i + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${car._id}-${i}/200/120`;
                    e.currentTarget.onerror = null;
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.leftCol}>
            <div className={styles.identity}>
              <div className={styles.identityMeta}>
                {carClass && (
                  <span className={styles.classBadge}>{carClass}</span>
                )}
                <span className={styles.year}>{car.year}</span>
              </div>
              <h1 className={styles.carName}>{car.name}</h1>
              <div className={styles.ratingRow}>
                <div className={styles.stars}>{renderStars(car.score)}</div>
                <span className={styles.ratingValue}>{car.score} out of 5</span>
                <span className={styles.reviewCount}>
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.specsSection}>
              <span className={styles.sectionLabel}>Specifications</span>
              <div className={styles.specsGrid}>
                {specs.map(({ icon, label, value }) => (
                  <div key={label} className={styles.specCard}>
                    <FontAwesomeIcon icon={icon} className={styles.specIcon} />
                    <div className={styles.specText}>
                      <span className={styles.specLabel}>{label}</span>
                      <span className={styles.specValue}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {description && (
              <>
                <div className={styles.descriptionSection}>
                  <span className={styles.sectionLabel}>About this car</span>
                  <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.divider} />
              </>
            )}

            {features.length > 0 && (
              <>
                <div className={styles.featuresSection}>
                  <span className={styles.sectionLabel}>What's included</span>
                  <ul className={styles.featureList}>
                    {features.map((f) => (
                      <li key={f} className={styles.featureItem}>
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className={styles.featureIcon}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.divider} />
              </>
            )}

            {reviews.length > 0 && (
              <div className={styles.reviewsSection} ref={reviewsRef}>
                <span className={styles.sectionLabel}>
                  Reviews ({reviews.length})
                </span>

                <div className={styles.reviewsList}>
                  {pagedReviews.map((review, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.reviewerAvatar}>
                            {review.reviewer.charAt(0)}
                          </div>
                          <div className={styles.reviewerMeta}>
                            <span className={styles.reviewerName}>
                              {review.reviewer}
                            </span>
                            <span className={styles.reviewDate}>
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.reviewStars}>
                          {renderStars(review.rating, true)}
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))}
                </div>

                {totalReviewPages > 1 && (
                  <div className={styles.reviewPagination}>
                    <button
                      className={styles.reviewPaginationArrow}
                      onClick={() => goToReviewPage(reviewPage - 1)}
                      disabled={reviewPage === 1}
                      aria-label="Previous page"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <div className={styles.reviewPaginationItems}>
                      {reviewPageItems.map((item, index) =>
                        item === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className={styles.reviewEllipsis}
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            className={`${styles.reviewPageNumber} ${
                              item === reviewPage
                                ? styles.reviewPageNumberActive
                                : ""
                            }`}
                            onClick={() => goToReviewPage(item)}
                            aria-label={`Go to page ${item}`}
                            aria-current={
                              item === reviewPage ? "page" : undefined
                            }
                          >
                            {item}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      className={styles.reviewPaginationArrow}
                      onClick={() => goToReviewPage(reviewPage + 1)}
                      disabled={reviewPage === totalReviewPages}
                      aria-label="Next page"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            <div className={styles.bookingCard}>
              <div className={styles.pricing}>
                {pricePerDay ? (
                  <>
                    <span className={styles.price}>${pricePerDay}</span>
                    <span className={styles.pricePer}>/ day</span>
                  </>
                ) : (
                  <span className={styles.priceOnRequest}>
                    Price on request
                  </span>
                )}
              </div>

              <div className={styles.bookingDivider} />

              <form className={styles.bookingForm} onSubmit={handleSubmit}>
                <span className={styles.bookingFormTitle}>
                  Reserve this car
                </span>

                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>
                    Pick-up Location
                  </label>
                  <div className={styles.bookingInputWrap}>
                    <svg
                      className={styles.bookingInputIcon}
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
                      className={styles.bookingInput}
                      placeholder="City, airport or address"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.dateRow}>
                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel}>Pick-up Date</label>
                    <div className={styles.bookingInputWrap}>
                      <svg
                        className={styles.bookingInputIcon}
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
                        className={styles.bookingInput}
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel}>Return Date</label>
                    <div className={styles.bookingInputWrap}>
                      <svg
                        className={styles.bookingInputIcon}
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
                        className={styles.bookingInput}
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className={styles.reserveButton}>
                  <FontAwesomeIcon icon={faShield} />
                  <span>Reserve Now</span>
                </button>

                <p className={styles.bookingNote}>
                  Free cancellation · No credit card charge today
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
