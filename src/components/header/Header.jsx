import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  faBars,
  faCar,
  faPenToSquare,
  faLocation,
  faXmark,
  faRightFromBracket,
  faGear,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("drivana_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("drivana_user");
      localStorage.removeItem("drivana_token");
      setUser(null);
      setIsLoggingOut(false);
      navigate("/");
    }, 800);
  };

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 750 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.brandContainer}>
          <FontAwesomeIcon
            className={`${styles.barIcon} ${
              isMobileMenuOpen ? styles.iconRotate : ""
            }`}
            icon={isMobileMenuOpen ? faXmark : faBars}
            onClick={handleOpenMobileMenu}
          />
          <a className={styles.brand} href="/">
            DRIVANA
          </a>
        </div>
        <nav className={styles.navLinks}>
          <a href="/#">Book a car</a>
          <a href="/bookings">Manage</a>
          <a href="/locations">Locations</a>
        </nav>

        <div className={styles.ctas}>
          {user ? (
            <div className={styles.userDropdownContainer}>
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className={styles.headerAvatar}
                />
              ) : (
                <div className={styles.headerAvatarFallback}>
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <span className={styles.greeting}>
                Hi, {user.fullName?.split(" ")[0] || "User"}
              </span>

              <div className={styles.dropdownModal}>
                <div className={styles.menuUserInfo}>
                  <p className={styles.menuUserName}>{user.fullName}</p>
                  <p className={styles.menuUserEmail}>{user.email}</p>
                </div>

                <div className={styles.menuDivider}></div>

                <button
                  className={styles.menuItem}
                  onClick={() => navigate("/profile")}
                >
                  <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
                  <span>My Profile</span>
                </button>

                <button
                  className={styles.menuItem}
                  onClick={() => navigate("/bookings")}
                >
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className={styles.menuIcon}
                  />
                  <span>My Bookings</span>
                </button>

                <button
                  className={styles.menuItem}
                  onClick={() => navigate("/#")}
                >
                  <FontAwesomeIcon icon={faGear} className={styles.menuIcon} />
                  <span>Settings</span>
                </button>

                <div className={styles.menuDivider}></div>

                <button
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className={styles.logoutText}>Logging out...</span>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className={styles.menuIconRed}
                      />
                      <span className={styles.logoutText}>Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className={styles.joinButton}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Join
              </button>
              <button
                className={styles.loginButton}
                onClick={() => {
                  navigate("/login");
                }}
              >
                <FontAwesomeIcon icon={faUser} /> Login
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`${styles.overlay} ${
          isMobileMenuOpen ? styles.overlayOpen : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <nav
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <a href="/#">
          <FontAwesomeIcon icon={faCar} /> Book a car
        </a>
        <a href="/bookings">
          <FontAwesomeIcon icon={faPenToSquare} /> Manage
        </a>
        <a href="/locations">
          <FontAwesomeIcon icon={faLocation} /> Locations
        </a>
      </nav>
    </>
  );
}
