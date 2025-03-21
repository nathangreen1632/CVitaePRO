import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpirationTime } from "../utils/tokenUtils";

interface UseActivityDetectorOptions {
  inactiveLimit?: number;
  countdownLimit?: number;
  onLogout: () => void;
  onExtendSession: () => void | Promise<void>;
}

export const useActivityDetector = ({
                                      inactiveLimit = 15 * 60 * 1000,
                                      countdownLimit = 2 * 60 * 1000,
                                      onLogout,
                                      onExtendSession,
                                    }: UseActivityDetectorOptions) => {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;
    let expirationTimeout: NodeJS.Timeout;

    const handleInactivity = () => {
      setShowWarning(true);

      countdownTimer = setTimeout(() => {
        sessionStorage.removeItem("intentionalLogout");
        onLogout();
        navigate("/login");
      }, countdownLimit);
    };

    const debounce = (fn: () => void, delay: number) => {
      let debounceTimer: NodeJS.Timeout;
      return () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, delay);
      };
    };

    const resetInactivityTimer = debounce(() => {
      if (showWarning) return;

      clearTimeout(inactivityTimer);
      clearTimeout(countdownTimer);

      onExtendSession();
      inactivityTimer = setTimeout(handleInactivity, inactiveLimit);
    }, 2000);

    const scheduleTokenExpirationWarning = () => {
      const token = localStorage.getItem("token");
      const expirationTime = token ? getTokenExpirationTime(token) : null;

      if (expirationTime) {
        const warningTime = expirationTime - 15 * 60 * 1000;
        const msUntilWarning = warningTime - Date.now();

        if (msUntilWarning > 0) {
          expirationTimeout = setTimeout(() => {
            handleInactivity();
          }, msUntilWarning);
        }
      }
    };

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);

    resetInactivityTimer();
    scheduleTokenExpirationWarning();

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(countdownTimer);
      clearTimeout(expirationTimeout);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
    };
  }, [inactiveLimit, countdownLimit, onLogout, onExtendSession, navigate, showWarning]);

  const acknowledgeActivity = () => {
    setShowWarning(false);
    onExtendSession();
  };

  return {
    showWarning,
    acknowledgeActivity,
  };
};
