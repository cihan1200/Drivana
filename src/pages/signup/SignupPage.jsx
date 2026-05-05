import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axiosApi from "../../api/axiosApi";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    if (!agreeTerms || !validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axiosApi.post("/auth/register", formData);
      localStorage.setItem("drivana_token", data.token);
      localStorage.setItem("drivana_user", JSON.stringify(data.result));
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
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
            Your journey.
            <br />
            Elevated.
          </h2>
          <p className={styles.overlayText}>
            Create an account to unlock premium fleet access, expedited booking,
            and exclusive member benefits.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
          alt="Luxury car driving on an open road"
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
            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>
              Join us today and start your journey.
            </p>
          </div>

          {errorMessage && (
            <div className={styles.errorAlert}>{errorMessage}</div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="fullName">
                Full Name
              </label>
              <div className={styles.inputWrapper}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={styles.input}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <span className={styles.checkmark}></span>I agree to the Terms &
                Conditions
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !agreeTerms}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <span>Sign Up</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={styles.btnIcon}
                  />
                </>
              )}
            </button>
          </form>

          <p className={styles.signupPrompt}>
            Already have an account?{" "}
            <Link to="/login" className={styles.signupLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
