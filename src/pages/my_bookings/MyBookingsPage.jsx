import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faLocationDot,
  faCalendarDay,
  faChair,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ConfirmationModal from "../../components/confirmation_modal/ConfirmationModal";
import styles from "./MyBookingsPage.module.css";
import axiosApi from "../../api/axiosApi";

const STATUS_LABELS = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calcNights(pickup, returnD) {
  if (!pickup || !returnD) return 0;
  const diff = new Date(returnD) - new Date(pickup);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const [editModal, setEditModal] = useState(null);
  const [editPickup, setEditPickup] = useState("");
  const [editReturn, setEditReturn] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const stored = localStorage.getItem("drivana_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("drivana_token");
      const res = await axiosApi.get(`/reservations/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.reservations || []);
    } catch {
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setCancelTarget(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setTimeout(() => setCancelTarget(null), 320);
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("drivana_token");
      await axiosApi.delete(
        `/cars/${cancelTarget.car._id}/cancel-reservation`,
        {
          params: { userId: user._id },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b,
        ),
      );
      closeCancelModal();
    } catch {
      alert("Failed to cancel reservation. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const openEditModal = (booking) => {
    setEditModal(booking);
    setEditPickup(booking.pickupDate?.slice(0, 10) || "");
    setEditReturn(booking.returnDate?.slice(0, 10) || "");
    setEditError("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setTimeout(() => setEditModal(null), 320);
  };

  const handleEditSave = async () => {
    if (!editPickup || !editReturn) {
      setEditError("Please select both dates.");
      return;
    }
    if (new Date(editReturn) <= new Date(editPickup)) {
      setEditError("Return date must be after pickup date.");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("drivana_token");
      const nights = calcNights(editPickup, editReturn);
      const newTotal = nights * (editModal.car?.specs?.pricePerDay || 0);
      const res = await axiosApi.put(
        `/reservations/${editModal._id}`,
        {
          pickupDate: editPickup,
          returnDate: editReturn,
          totalPrice: newTotal,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === editModal._id ? { ...b, ...res.data.reservation } : b,
        ),
      );
      closeEditModal();
    } catch (err) {
      setEditError(
        err?.response?.data?.message || "Failed to update reservation.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const filtered =
    filter === "all"
      ? bookings.filter((b) => b.status !== "cancelled")
      : bookings.filter((b) => b.status === filter);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.mainHeader}>
            <div>
              <h1 className={styles.title}>My Bookings</h1>
              <p className={styles.subtitle}>
                View and manage your car reservations.
              </p>
            </div>
            <div className={styles.filterRow}>
              {["all", "confirmed", "completed", "cancelled"].map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
              <p>Loading your bookings...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.stateBox}>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryBtn} onClick={fetchBookings}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FontAwesomeIcon icon={faCar} />
              </div>
              <h3>No bookings found</h3>
              <p>
                {filter === "all"
                  ? "You haven't made any reservations yet."
                  : `No ${filter} reservations.`}
              </p>
              <button
                className={styles.browseBtn}
                onClick={() => navigate("/cars")}
              >
                Browse Cars
              </button>
            </div>
          )}

          <div className={styles.bookingList}>
            {filtered.map((booking) => {
              const nights = calcNights(booking.pickupDate, booking.returnDate);
              const car = booking.car;
              return (
                <div
                  key={booking._id}
                  className={`${styles.card} ${styles[booking.status]}`}
                >
                  <div
                    className={styles.cardImage}
                    onClick={() => navigate(`/cars/${car?._id}`)}
                  >
                    <img
                      src={
                        car?.image ||
                        `https://picsum.photos/seed/${car?._id || "car"}/400/300`
                      }
                      alt={car?.name || "Car"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://picsum.photos/seed/${car?._id || "fallback"}/400/300`;
                      }}
                    />
                    <span
                      className={`${styles.statusBadge} ${styles[`badge_${booking.status}`]}`}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <div>
                        {car?.specs?.class && (
                          <span className={styles.classTag}>
                            {car.specs.class.toUpperCase()}
                          </span>
                        )}
                        <h2 className={styles.carName}>
                          {car?.name || "Unknown Car"}{" "}
                          <span className={styles.carYear}>{car?.year}</span>
                        </h2>
                      </div>
                      <div className={styles.priceBlock}>
                        <span className={styles.totalPrice}>
                          ${booking.totalPrice?.toLocaleString()}
                        </span>
                        <span className={styles.priceNote}>
                          {nights} night{nights !== 1 ? "s" : ""} · $
                          {car?.specs?.pricePerDay}/day
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ marginRight: "4px" }}
                          />{" "}
                          Pick-up
                        </span>
                        <span className={styles.metaValue}>
                          {booking.pickupLocation}
                        </span>
                      </div>
                      <div className={styles.metaDivider} />
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>
                          <FontAwesomeIcon
                            icon={faCalendarDay}
                            style={{ marginRight: "4px" }}
                          />{" "}
                          Dates
                        </span>
                        <span className={styles.metaValue}>
                          {formatDate(booking.pickupDate)} →{" "}
                          {formatDate(booking.returnDate)}
                        </span>
                      </div>
                      <div className={styles.metaDivider} />
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>
                          <FontAwesomeIcon
                            icon={faChair}
                            style={{ marginRight: "4px" }}
                          />{" "}
                          Seats
                        </span>
                        <span className={styles.metaValue}>
                          {car?.specs?.seats || "—"} seats
                        </span>
                      </div>
                      <div className={styles.metaDivider} />
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>
                          <FontAwesomeIcon
                            icon={faGasPump}
                            style={{ marginRight: "4px" }}
                          />{" "}
                          Fuel
                        </span>
                        <span className={styles.metaValue}>
                          {car?.specs?.fuelType || "—"}
                        </span>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className={styles.cardActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => openEditModal(booking)}
                        >
                          Edit Dates
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => openCancelModal(booking)}
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelConfirm}
        title="Cancel Reservation?"
        message={`Are you sure you want to cancel your reservation for ${cancelTarget?.car?.name}? This action cannot be undone.`}
        confirmText="Yes, Cancel"
        cancelText="Keep it"
        isDestructive={true}
        isLoading={cancelLoading}
      />

      {(editModal || showEditModal) && (
        <div
          className={`${styles.overlay} ${!showEditModal ? styles.overlayClosing : ""}`}
          onClick={closeEditModal}
        >
          <div
            className={`${styles.editModalBox} ${!showEditModal ? styles.modalClosing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.editModalHeader}>
              <h2 className={styles.editModalTitle}>Edit Reservation</h2>
            </div>

            <div className={styles.editModalBody}>
              <p className={styles.editModalMessage}>
                Update your dates for <strong>{editModal?.car?.name}</strong>.
              </p>

              <div className={styles.editFields}>
                <label className={styles.editLabel}>
                  Pick-up Date
                  <input
                    type="date"
                    className={styles.editInput}
                    value={editPickup}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setEditPickup(e.target.value)}
                  />
                </label>
                <label className={styles.editLabel}>
                  Return Date
                  <input
                    type="date"
                    className={styles.editInput}
                    value={editReturn}
                    min={editPickup || new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setEditReturn(e.target.value)}
                  />
                </label>
              </div>

              {editPickup &&
                editReturn &&
                new Date(editReturn) > new Date(editPickup) && (
                  <p className={styles.editSummary}>
                    {calcNights(editPickup, editReturn)} nights ·{" "}
                    <strong>
                      $
                      {(
                        calcNights(editPickup, editReturn) *
                        (editModal?.car?.specs?.pricePerDay || 0)
                      ).toLocaleString()}
                    </strong>{" "}
                    total
                  </p>
                )}

              {editError && <p className={styles.editError}>{editError}</p>}
            </div>

            <div className={styles.editModalActions}>
              <button
                className={styles.editCancelBtn}
                onClick={closeEditModal}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                className={styles.editConfirmBtn}
                onClick={handleEditSave}
                disabled={editLoading}
              >
                {editLoading ? (
                  <div className={styles.editSpinner} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
