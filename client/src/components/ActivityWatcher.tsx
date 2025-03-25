import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useActivityDetector } from "../hooks/useActivityDetector.js";
import SessionWarningModal from "./SessionWarningModal.jsx";
import { refreshToken } from "../utils/refreshToken.js";

const ActivityWatcher: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  const { showWarning, acknowledgeActivity } = useActivityDetector({
    inactiveLimit: 15 * 60 * 1000,
    countdownLimit: 2 * 60 * 1000,
    onLogout: auth?.logout || (() => {}),
    onExtendSession: async () => {
      const success = await refreshToken();
      if (!success) {
        auth?.logout?.();
      }
    },
  });

  if (!auth) return null;

  return (
    <>
      {showWarning && (
        <SessionWarningModal
          onStayLoggedIn={acknowledgeActivity}
          onLogout={auth.logout}
        />
      )}
      {children}
    </>
  );
};

export default ActivityWatcher;
