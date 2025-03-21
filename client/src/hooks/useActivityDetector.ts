import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UseActivityDetectorOptions {
  inactiveLimit?: number;
  countdownLimit?: number;
  onLogout: () => void;
  onExtendSession: () => void;
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

    const handleInactivity = () => {
      console.warn("⚠️ Inactivity threshold reached — showing modal.");
      setShowWarning(true);

      countdownTimer = setTimeout(() => {
        console.warn("⛔ Auto-logging out after countdown.");
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

      onExtendSession(); // optional backend ping
      console.log("🖱️ Activity detected — resetting inactivity timer.");

      inactivityTimer = setTimeout(handleInactivity, inactiveLimit);
    }, 2000);

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);

    inactivityTimer = setTimeout(handleInactivity, inactiveLimit);

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(countdownTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
    };
  }, [inactiveLimit, countdownLimit, onLogout, onExtendSession, navigate, showWarning]);

  const acknowledgeActivity = () => {
    console.log("✅ User clicked 'I'm still here' — session extended.");
    setShowWarning(false);
    onExtendSession();
  };

  return {
    showWarning,
    acknowledgeActivity,
  };
};
