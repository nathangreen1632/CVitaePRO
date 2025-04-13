import React, { useContext, useCallback } from "react";
import { AuthContext } from "../../../context/AuthContext.tsx";
import { useActivityDetector } from "../../../hooks/useActivityDetector.ts";
import SessionWarningModal from "../modals/SessionWarningModal.tsx";
import { refreshToken } from "../../../utils/refreshToken.ts";
import { useNavigate } from "react-router-dom";

const ActivityWatcher: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    if (!auth) return;
    auth.logout();
    navigate('/login', { replace: true });
  }, [auth, navigate]);

  const { showWarning, acknowledgeActivity } = useActivityDetector({
    inactiveLimit: 15 * 60 * 1000,
    countdownLimit: 2 * 60 * 1000,
    onLogout: handleLogout,
    onExtendSession: async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (!token) return;

        const success = await refreshToken();
        if (!success) {
          handleLogout();
        }
      }
    },
  });

  if (!auth) return null;

  return (
    <>
      {showWarning && (
        <SessionWarningModal
          onStayLoggedIn={acknowledgeActivity}
          onLogout={handleLogout}
        />
      )}
      {children}
    </>
  );
};

export default ActivityWatcher;
