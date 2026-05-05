// components/ServerWakeUp/ServerWakeUp.jsx
import React from "react";

export default function ServerWakeUp() {
  return (
    <div style={styles.container}>
      {/* You can reuse your existing CSS spinner here */}
      <div style={styles.spinner}></div>
      <h2 style={styles.title}>Waking up the engine...</h2>
      <p style={styles.subtitle}>
        Please hang tight for just a moment. We use a free hosting service, so
        the server occasionally needs a few seconds to warm up from sleep mode!
      </p>
    </div>
  );
}

// Inline styles for simplicity, but feel free to move this to a CSS module
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafaf8", // Matching your minimalist theme
    padding: "0 20px",
    textAlign: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(0, 0, 0, 0.1)",
    borderTopColor: "#1a1a1a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  title: {
    color: "#1a1a1a",
    fontSize: "1.5rem",
    fontWeight: "500",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#888",
    fontSize: "1rem",
    maxWidth: "450px",
    lineHeight: "1.5",
  },
};
