import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useActivityDetector } from "../hooks/useActivityDetector";
import SessionWarningModal from "./SessionWarningModal";

const ActivityWatcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, token } = useContext(AuthContext)!;

  // 🔁 Simulated session extension (swap with real refresh if needed)
  const refreshSession = () => {
    if (token) {
      localStorage.setItem("token", token); // Simulate refreshing the JWT
    }
  };

  const { showWarning, acknowledgeActivity } = useActivityDetector({
    inactiveLimit: 15 * 60 * 1000,
    countdownLimit: 2 * 60 * 1000,
    onLogout: logout,
    onExtendSession: refreshSession,
  });

  return (
    <>
      {/* ⚠️ Show modal when inactivity timeout is reached */}
      {showWarning && (
        <SessionWarningModal
          onStayLoggedIn={acknowledgeActivity}
          onLogout={logout}
        />
      )}
      {children}
    </>
  );
};

export default ActivityWatcher;
