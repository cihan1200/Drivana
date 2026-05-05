import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axiosApi from "../../api/axiosApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage("");
  };

  const validateForm = () => {
    if (formData.email.length > 250) {
      setErrorMessage("Email cannot exceed 250 characters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axiosApi.post("/auth/login", formData);
      localStorage.setItem("drivana_token", data.token);
      localStorage.setItem("drivana_user", JSON.stringify(data.result));
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to log in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.imageCol}>
        <div className={styles.imageOverlay}>
          <h2 className={styles.overlayTitle}>
            Premium Fleet.
            <br />
            Unforgettable Journeys.
          </h2>
          <p className={styles.overlayText}>
            Sign in to manage your reservations, save your favorite cars, and
            access exclusive member rates.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop"
          alt="Luxury car on a dark road"
          className={styles.bgImage}
        />
      </div>

      <div className={styles.formCol}>
        <div className={styles.formContainer}>
          <div className={styles.brandHeader}>
            <Link to="/" className={styles.brand}>
              DRIVANA
            </Link>
          </div>

          <div className={styles.headerText}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Please enter your details to sign in.
            </p>
          </div>

          {errorMessage && (
            <div className={styles.errorAlert}>{errorMessage}</div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={styles.inputIcon}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <div className={styles.inputWrapper}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkmark}></span>
                Remember for 30 days
              </label>

              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={styles.btnIcon}
                  />
                </>
              )}
            </button>
          </form>

          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
