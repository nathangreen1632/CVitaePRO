import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useActivityDetector } from "../hooks/useActivityDetector.jsx";
import SessionWarningModal from "./SessionWarningModal.jsx";
import { refreshToken } from "../utils/refreshToken.js";

const ActivityWatcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useContext(AuthContext)!;

  const refreshSession = async () => {
    const success = await refreshToken();
    if (!success) {
      logout();
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
