import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header/Header";
import ConfirmationModal from "../../components/confirmation_modal/ConfirmationModal";
import axiosApi from "../../api/axiosApi";

const countriesData = {
  Afghanistan: "+93",
  Albania: "+355",
  Algeria: "+213",
  Andorra: "+376",
  Angola: "+244",
  "Antigua and Barbuda": "+1",
  Argentina: "+54",
  Armenia: "+374",
  Australia: "+61",
  Austria: "+43",
  Azerbaijan: "+994",
  Bahamas: "+1",
  Bahrain: "+973",
  Bangladesh: "+880",
  Barbados: "+1",
  Belarus: "+375",
  Belgium: "+32",
  Belize: "+501",
  Benin: "+229",
  Bhutan: "+975",
  Bolivia: "+591",
  "Bosnia and Herzegovina": "+387",
  Botswana: "+267",
  Brazil: "+55",
  Brunei: "+673",
  Bulgaria: "+359",
  "Burkina Faso": "+226",
  Burundi: "+257",
  "Cabo Verde": "+238",
  Cambodia: "+855",
  Cameroon: "+237",
  Canada: "+1",
  "Central African Republic": "+236",
  Chad: "+235",
  Chile: "+56",
  China: "+86",
  Colombia: "+57",
  Comoros: "+269",
  Congo: "+242",
  "Costa Rica": "+506",
  Croatia: "+385",
  Cuba: "+53",
  Cyprus: "+357",
  "Czech Republic": "+420",
  Denmark: "+45",
  Djibouti: "+253",
  Dominica: "+1",
  "Dominican Republic": "+1",
  Ecuador: "+593",
  Egypt: "+20",
  "El Salvador": "+503",
  "Equatorial Guinea": "+240",
  Eritrea: "+291",
  Estonia: "+372",
  Eswatini: "+268",
  Ethiopia: "+251",
  Fiji: "+679",
  Finland: "+358",
  France: "+33",
  Gabon: "+241",
  Gambia: "+220",
  Georgia: "+995",
  Germany: "+49",
  Ghana: "+233",
  Greece: "+30",
  Grenada: "+1",
  Guatemala: "+502",
  Guinea: "+224",
  "Guinea-Bissau": "+245",
  Guyana: "+592",
  Haiti: "+509",
  Honduras: "+504",
  Hungary: "+36",
  Iceland: "+354",
  India: "+91",
  Indonesia: "+62",
  Iran: "+98",
  Iraq: "+964",
  Ireland: "+353",
  Israel: "+972",
  Italy: "+39",
  Jamaica: "+1",
  Japan: "+81",
  Jordan: "+962",
  Kazakhstan: "+7",
  Kenya: "+254",
  Kiribati: "+686",
  Kuwait: "+965",
  Kyrgyzstan: "+996",
  Laos: "+856",
  Latvia: "+371",
  Lebanon: "+961",
  Lesotho: "+266",
  Liberia: "+231",
  Libya: "+218",
  Liechtenstein: "+423",
  Lithuania: "+370",
  Luxembourg: "+352",
  Madagascar: "+261",
  Malawi: "+265",
  Malaysia: "+60",
  Maldives: "+960",
  Mali: "+223",
  Malta: "+356",
  "Marshall Islands": "+692",
  Mauritania: "+222",
  Mauritius: "+230",
  Mexico: "+52",
  Micronesia: "+691",
  Moldova: "+373",
  Monaco: "+377",
  Mongolia: "+976",
  Montenegro: "+382",
  Morocco: "+212",
  Mozambique: "+258",
  Myanmar: "+95",
  Namibia: "+264",
  Nauru: "+674",
  Nepal: "+977",
  Netherlands: "+31",
  "New Zealand": "+64",
  Nicaragua: "+505",
  Niger: "+227",
  Nigeria: "+234",
  "North Korea": "+850",
  "North Macedonia": "+389",
  Norway: "+47",
  Oman: "+968",
  Pakistan: "+92",
  Palau: "+680",
  Palestine: "+970",
  Panama: "+507",
  "Papua New Guinea": "+675",
  Paraguay: "+595",
  Peru: "+51",
  Philippines: "+63",
  Poland: "+48",
  Portugal: "+351",
  Qatar: "+974",
  Romania: "+40",
  Russia: "+7",
  Rwanda: "+250",
  "Saint Kitts and Nevis": "+1",
  "Saint Lucia": "+1",
  "Saint Vincent and the Grenadines": "+1",
  Samoa: "+685",
  "San Marino": "+378",
  "Sao Tome and Principe": "+239",
  "Saudi Arabia": "+966",
  Senegal: "+221",
  Serbia: "+381",
  Seychelles: "+248",
  "Sierra Leone": "+232",
  Singapore: "+65",
  Slovakia: "+421",
  Slovenia: "+386",
  "Solomon Islands": "+677",
  Somalia: "+252",
  "South Africa": "+27",
  "South Korea": "+82",
  "South Sudan": "+211",
  Spain: "+34",
  "Sri Lanka": "+94",
  Sudan: "+249",
  Suriname: "+597",
  Sweden: "+46",
  Switzerland: "+41",
  Syria: "+963",
  Taiwan: "+886",
  Tajikistan: "+992",
  Tanzania: "+255",
  Thailand: "+66",
  "Timor-Leste": "+670",
  Togo: "+228",
  Tonga: "+676",
  "Trinidad and Tobago": "+1",
  Tunisia: "+216",
  Turkey: "+90",
  Turkmenistan: "+993",
  Tuvalu: "+688",
  Uganda: "+256",
  Ukraine: "+380",
  "United Arab Emirates": "+971",
  "United Kingdom": "+44",
  "United States": "+1",
  Uruguay: "+598",
  Uzbekistan: "+998",
  Vanuatu: "+678",
  "Vatican City": "+379",
  Venezuela: "+58",
  Vietnam: "+84",
  Yemen: "+967",
  Zambia: "+260",
  Zimbabwe: "+263",
};

const formatPhone = (val, country) => {
  const dialCode = countriesData[country];

  if (!dialCode) {
    const rawDigits = val.replace(/[^\d]/g, "");
    if (rawDigits.length > 15) return val.slice(0, -1);
    return val.replace(/[^\d+()\-\s]/g, "");
  }

  let cleaned = val.replace(/[^\d+]/g, "");

  if (cleaned === "") return "";

  if (!cleaned.startsWith(dialCode)) {
    cleaned = dialCode + cleaned.replace(/^\+/, "");
  }

  let body = cleaned.slice(dialCode.length);
  let maxBodyLength;

  if (dialCode === "+1") {
    maxBodyLength = 10;
  } else if (dialCode === "+44") {
    maxBodyLength = 10;
  } else {
    maxBodyLength = 15 - (dialCode.length - 1);
  }

  body = body.slice(0, maxBodyLength);

  if (body.length === 0) return `${dialCode} `;

  if (dialCode === "+1") {
    if (body.length <= 3) return `${dialCode} (${body}`;
    if (body.length <= 6)
      return `${dialCode} (${body.slice(0, 3)}) ${body.slice(3)}`;
    return `${dialCode} (${body.slice(0, 3)}) ${body.slice(3, 6)}-${body.slice(6, 10)}`;
  } else if (dialCode === "+44") {
    if (body.length <= 4) return `${dialCode} ${body}`;
    return `${dialCode} ${body.slice(0, 4)} ${body.slice(4, 10)}`;
  } else {
    let formatted = `${dialCode} `;
    for (let i = 0; i < body.length; i++) {
      if (i === 3 || i === 6 || i === 10) formatted += " ";
      formatted += body[i];
    }
    return formatted.trim();
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profilePhoto: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("drivana_user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || "",
      email: parsedUser.email || "",
      location: parsedUser.location || "",
      phone: parsedUser.phone
        ? formatPhone(parsedUser.phone, parsedUser.location)
        : "",
      profilePhoto: parsedUser.profilePhoto || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "location") {
      const newLocation = value;

      setFormData((prev) => {
        const newDialCode = countriesData[newLocation];
        const oldDialCode = prev.location ? countriesData[prev.location] : null;
        let newPhone = prev.phone;

        if (oldDialCode && newPhone.startsWith(oldDialCode)) {
          newPhone = newDialCode + newPhone.slice(oldDialCode.length);
        } else if (!newPhone || newPhone.trim() === "") {
          newPhone = newDialCode + " ";
        } else if (newDialCode && !newPhone.startsWith(newDialCode)) {
          newPhone = newDialCode + " " + newPhone.replace(/[^\d]/g, "");
        }

        return {
          ...prev,
          location: newLocation,
          phone: formatPhone(newPhone, newLocation),
        };
      });

      if (statusMessage.text) setStatusMessage({ type: "", text: "" });
      return;
    }

    let newValue = value;
    if (name === "phone") {
      newValue = formatPhone(value, formData.location);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (statusMessage.text) setStatusMessage({ type: "", text: "" });
  };

  const handleEditAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhotoClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const { data } = await axiosApi.put(`/auth/profile/${user._id}`, {
        ...formData,
        profilePhoto: "",
      });

      const updatedUser = data.result;
      localStorage.setItem("drivana_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, profilePhoto: "" }));

      setStatusMessage({
        type: "success",
        text: "Profile photo removed.",
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to remove photo.",
      });
    } finally {
      setIsUploadingPhoto(false);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({
        type: "error",
        text: "Image must be smaller than 5MB.",
      });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      return;
    }

    setIsUploadingPhoto(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const newPhotoUrl = reader.result;

        const { data } = await axiosApi.put(`/auth/profile/${user._id}`, {
          ...formData,
          profilePhoto: newPhotoUrl,
        });

        const updatedUser = data.result;
        localStorage.setItem("drivana_user", JSON.stringify(updatedUser));

        setUser(updatedUser);
        setFormData((prev) => ({ ...prev, profilePhoto: newPhotoUrl }));

        setStatusMessage({
          type: "success",
          text: "Profile photo updated successfully.",
        });
        setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update profile photo.",
      });
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const { data } = await axiosApi.put(
        `/auth/profile/${user._id}`,
        formData,
      );

      const updatedUser = data.result;

      localStorage.setItem("drivana_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setStatusMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("drivana_user");
    localStorage.removeItem("drivana_token");
    navigate("/");
  };

  if (!user) return null;

  const initials = formData.fullName
    ? formData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <Header />
      <div className={styles.pageWrap}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarUser}>
              <div className={styles.avatarSmall}>
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className={styles.avatarImage}
                  />
                ) : (
                  initials
                )}
              </div>
              <div className={styles.sidebarMeta}>
                <span className={styles.sidebarName}>{user.fullName}</span>
                <span className={styles.sidebarEmail}>{user.email}</span>
              </div>
            </div>

            <nav className={styles.navMenu}>
              <button className={`${styles.navItem} ${styles.navItemActive}`}>
                My Profile
              </button>
              <button className={styles.navItem} onClick={() => navigate("#")}>
                My Bookings
              </button>
              <button className={styles.navItem} onClick={() => navigate("#")}>
                Settings
              </button>
              <button
                className={`${styles.navItem} ${styles.navItemDanger}`}
                onClick={handleLogout}
              >
                Logout
              </button>
            </nav>
          </aside>

          <main className={styles.content}>
            <div className={styles.contentHeader}>
              <h1 className={styles.title}>Personal Information</h1>
              <p className={styles.subtitle}>
                Manage your personal details and contact preferences.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                  {isUploadingPhoto ? (
                    <div className={styles.spinnerDark}></div>
                  ) : formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Profile"
                      className={styles.avatarImage}
                    />
                  ) : (
                    initials
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/gif"
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className={styles.avatarEditBtn}
                    onClick={handleEditAvatarClick}
                    aria-label="Change photo"
                    disabled={isUploadingPhoto}
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                </div>
                <div className={styles.avatarText}>
                  <span className={styles.avatarTitle}>Profile Photo</span>
                  <span className={styles.avatarSubtitle}>
                    JPG, GIF or PNG. Max size of 5MB.
                  </span>
                  {formData.profilePhoto && (
                    <button
                      type="button"
                      className={styles.removePhotoBtn}
                      onClick={handleRemovePhotoClick}
                      disabled={isUploadingPhoto}
                    >
                      Remove picture
                    </button>
                  )}
                </div>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="fullName">
                      Full Name
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={styles.input}
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">
                      Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="name@example.com"
                        maxLength={250}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="phone">
                      Phone Number
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={styles.input}
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="location">
                      Location
                    </label>
                    <div className={styles.inputWrapper}>
                      <select
                        id="location"
                        name="location"
                        className={styles.input}
                        value={formData.location}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select your country
                        </option>
                        {Object.keys(countriesData).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
      {statusMessage.text && (
        <div
          className={`${styles.floatingAlert} ${styles[`alert-${statusMessage.type}`]}`}
        >
          <FontAwesomeIcon
            icon={
              statusMessage.type === "success"
                ? faCheckCircle
                : faCircleExclamation
            }
            className={styles.alertIcon}
          />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmRemovePhoto}
        title="Remove Profile Photo"
        message="Are you sure you want to remove your profile photo? This action cannot be undone."
        confirmText="Remove Photo"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isUploadingPhoto}
      />
    </>
  );
}
