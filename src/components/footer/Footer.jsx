import styles from "./Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const NAV_COLUMNS = [
  {
    heading: "Rent",
    links: [
      { label: "Browse Fleet", href: "#" },
      { label: "Book a Car", href: "#" },
      { label: "Locations", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Manage",
    links: [
      { label: "My Reservations", href: "#" },
      { label: "Extend a Rental", href: "#" },
      { label: "Cancel Booking", href: "#" },
      { label: "Loyalty Rewards", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Drivana", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: faInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: faXTwitter, href: "https://x.com", label: "X / Twitter" },
  { icon: faFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: faEnvelope, href: "mailto:hello@drivana.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a className={styles.brandName} href="/">
              DRIVANA
            </a>
            <p className={styles.tagline}>
              Handpicked vehicles.
              <br />
              Transparent pricing. No hidden fees.
            </p>
            <div className={styles.socials}>
              {SOCIAL_LINKS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={icon} />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.columns}>
            {NAV_COLUMNS.map(({ heading, links }) => (
              <div key={heading} className={styles.column}>
                <span className={styles.columnHeading}>{heading}</span>
                <ul className={styles.linkList}>
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className={styles.link}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Drivana. All rights reserved.
          </span>
          <span className={styles.madeWith}>
            Built with care for the open road.
          </span>
        </div>
      </div>
    </footer>
  );
}
