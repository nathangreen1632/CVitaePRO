import { useEffect, useState } from 'react';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import { getTokenExpirationTime } from '../utils/tokenUtils';

interface UseActivityDetectorOptions {
  inactiveLimit?: number;
  countdownLimit?: number;
  onLogout: () => void;
  onExtendSession: () => void | Promise<void>;
}

export const useActivityDetector: ({inactiveLimit, countdownLimit, onLogout, onExtendSession }: UseActivityDetectorOptions) => {showWarning: boolean, acknowledgeActivity: () => void} = ({
                                      inactiveLimit = 15 * 60 * 1000,
                                      countdownLimit = 2 * 60 * 1000,
                                      onLogout,
                                      onExtendSession,
                                    }: UseActivityDetectorOptions) => {
  const [showWarning, setShowWarning] = useState(false);
  const navigate: NavigateFunction = useNavigate();

  let inactivityTimer: NodeJS.Timeout;
  let countdownTimer: NodeJS.Timeout;
  let expirationTimeout: NodeJS.Timeout;

  const clearAllTimers: () => void = (): void => {
    clearTimeout(inactivityTimer);
    clearTimeout(countdownTimer);
    clearTimeout(expirationTimeout);
  };

  useEffect((): () => void => {
    const handleInactivity: () => void = (): void => {
      setShowWarning(true);

      countdownTimer = setTimeout((): void => {
        sessionStorage.removeItem("intentionalLogout");
        onLogout();
        navigate("/home");
      }, countdownLimit);
    };

    const debounce: (fn: () => void, delay: number) => () => void = (fn: () => void, delay: number): () => void => {
      let debounceTimer: NodeJS.Timeout;
      return (): void => {
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
      const token: string | null = localStorage.getItem("token");
      const expirationTime: number | null = token ? getTokenExpirationTime(token) : null;

      if (expirationTime) {
        const warningTime: number = expirationTime - 15 * 60 * 1000;
        const msUntilWarning: number = warningTime - Date.now();

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

    return (): void => {
      clearAllTimers();
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
    };
  }, [inactiveLimit, countdownLimit, onLogout, onExtendSession, navigate, showWarning]);

  const acknowledgeActivity: () => void = (): void => {
    setShowWarning(false);

    clearAllTimers();
    onExtendSession();

    const token: string | null = localStorage.getItem("token");
    const expirationTime: number | null = token ? getTokenExpirationTime(token) : null;

    if (expirationTime) {
      const warningTime: number = expirationTime - 15 * 60 * 1000;
      const msUntilWarning: number = warningTime - Date.now();

      if (msUntilWarning > 0) {
        expirationTimeout = setTimeout(() => {
          setShowWarning(true);
        }, msUntilWarning);
      }
    }

    inactivityTimer = setTimeout(() => {
      setShowWarning(true);

      countdownTimer = setTimeout(() => {
        sessionStorage.removeItem("intentionalLogout");
        onLogout();
        navigate("/home");
      }, countdownLimit);
    }, inactiveLimit);
  };

  return {
    showWarning,
    acknowledgeActivity,
  };
};
