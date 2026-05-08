import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CarsPage from "./pages/cars/CarsPage";
import CarDetailsPage from "./pages/car_details/CarDetailsPage";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MyBookingsPage from "./pages/my_bookings/MyBookingsPage";
import LocationsPage from "./pages/locations/LocationsPage";
import ServerWakeUp from "./components/server_wakeup/ServerWakeup";
import axiosApi from "./api/axiosApi";

export default function App() {
  const [isServerReady, setIsServerReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showWakeUpScreen, setShowWakeUpScreen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const delayTimer = setTimeout(() => {
      if (isMounted) {
        setShowWakeUpScreen(true);
      }
    }, 1000);

    const wakeUpServer = async () => {
      try {
        await axiosApi.get("/");

        if (isMounted) {
          clearTimeout(delayTimer);
          setIsServerReady(true);
        }
      } catch (error) {
        console.error("Failed to reach server:", error);
        if (isMounted) {
          clearTimeout(delayTimer);
          setHasError(true);
        }
      }
    };

    wakeUpServer();

    return () => {
      isMounted = false;
      clearTimeout(delayTimer);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Oops! Something went wrong.</h2>
        <p>We couldn't connect to the server. Please try refreshing.</p>
      </div>
    );
  }

  if (!isServerReady) {
    if (showWakeUpScreen) {
      return <ServerWakeUp />;
    }
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/locations" element={<LocationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
