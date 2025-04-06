import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.tsx";
import { useActivityDetector } from "../../../hooks/useActivityDetector.ts";
import SessionWarningModal from "../modals/SessionWarningModal.tsx";
import { refreshToken } from "../../../utils/refreshToken.ts";

const ActivityWatcher: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);

  const { showWarning, acknowledgeActivity } = useActivityDetector({
    inactiveLimit: 15 * 60 * 1000,
    countdownLimit: 2 * 60 * 1000,
    onLogout: auth?.logout || (() => {}),
    onExtendSession: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.info("Skipping refresh — no token present");
        return;
      }
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
