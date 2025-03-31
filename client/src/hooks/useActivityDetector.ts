import { useEffect, useRef, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getTokenExpirationTime } from '../utils/tokenUtils';

interface UseActivityDetectorOptions {
  inactiveLimit?: number;
  countdownLimit?: number;
  onLogout: () => void;
  onExtendSession: () => void | Promise<void>;
}

export const useActivityDetector: ({
                                     inactiveLimit,
                                     countdownLimit,
                                     onLogout,
                                     onExtendSession,
                                   }: UseActivityDetectorOptions) => {
  showWarning: boolean;
  acknowledgeActivity: () => void;
} = ({
       inactiveLimit = 15 * 60 * 1000,
       countdownLimit = 2 * 60 * 1000,
       onLogout,
       onExtendSession,
     }: UseActivityDetectorOptions) => {
  const [showWarning, setShowWarning] = useState(false);
  const navigate: NavigateFunction = useNavigate();

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = (): void => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    if (expirationTimeoutRef.current) clearTimeout(expirationTimeoutRef.current);
  };

  useEffect((): () => void => {
    const handleInactivity = (): void => {
      setShowWarning(true);

      countdownTimerRef.current = setTimeout((): void => {
        sessionStorage.removeItem('intentionalLogout');
        onLogout();
        navigate('/');
      }, countdownLimit);
    };

    const debounce = (fn: () => void, delay: number): (() => void) => {
      let debounceTimer: NodeJS.Timeout;
      return (): void => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, delay);
      };
    };

    const resetInactivityTimer = debounce(() => {
      if (showWarning) return;

      clearAllTimers();

      const token = localStorage.getItem("token");
      const expiration = token ? getTokenExpirationTime(token) : null;

      if (expiration && expiration - Date.now() < 2 * 60 * 1000) {
        onExtendSession();
      }

      inactivityTimerRef.current = setTimeout(handleInactivity, inactiveLimit);
    }, 2000);


    const scheduleTokenExpirationWarning = (): void => {
      const token = localStorage.getItem('token');
      const expirationTime = token ? getTokenExpirationTime(token) : null;

      if (expirationTime) {
        const warningTime = expirationTime - 15 * 60 * 1000;
        const msUntilWarning = warningTime - Date.now();

        if (msUntilWarning > 0) {
          expirationTimeoutRef.current = setTimeout(() => {
            handleInactivity();
          }, msUntilWarning);
        } else {
          handleInactivity();
        }
      }
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer, { passive: true });
    window.addEventListener('wheel', resetInactivityTimer, { passive: true });
    window.addEventListener('touchmove', resetInactivityTimer, { passive: true });


    resetInactivityTimer();
    scheduleTokenExpirationWarning();

    return (): void => {
      clearAllTimers();
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('wheel', resetInactivityTimer);
      window.removeEventListener('touchmove', resetInactivityTimer);
    };
  }, [
    inactiveLimit,
    countdownLimit,
    onLogout,
    onExtendSession,
    navigate,
    showWarning,
  ]);

  const acknowledgeActivity = (): void => {
    setShowWarning(false);

    clearAllTimers();
    onExtendSession();

    const token = localStorage.getItem('token');
    const expirationTime = token ? getTokenExpirationTime(token) : null;

    if (expirationTime) {
      const warningTime = expirationTime - 15 * 60 * 1000;
      const msUntilWarning = warningTime - Date.now();

      if (msUntilWarning > 0) {
        expirationTimeoutRef.current = setTimeout(() => {
          setShowWarning(true);
        }, msUntilWarning);
      }
    }

    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true);

      countdownTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem('intentionalLogout');
        onLogout();
        navigate('/');
      }, countdownLimit);
    }, inactiveLimit);
  };

  return {
    showWarning,
    acknowledgeActivity,
  };
};
