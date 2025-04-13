import { useEffect, useRef, useState, useCallback } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getTokenExpirationTime } from '../utils/tokenUtils';

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
  const navigate: NavigateFunction = useNavigate();

  const [showWarning, setShowWarning] = useState(false);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (expirationTimerRef.current) clearTimeout(expirationTimerRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const startInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true);

      countdownTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem('intentionalLogout');
        onLogout();
        navigate('/');
      }, countdownLimit);
    }, inactiveLimit);
  }, [inactiveLimit, countdownLimit, onLogout, navigate]);

  const startExpirationTimer = useCallback(() => {
    if (expirationTimerRef.current) clearTimeout(expirationTimerRef.current);

    const token = localStorage.getItem('token');
    const expiration = token ? getTokenExpirationTime(token) : null;

    if (!expiration) return;

    const timeUntilWarning = expiration - Date.now() - countdownLimit;

    if (timeUntilWarning <= 0) {
      setShowWarning(true);

      countdownTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem('intentionalLogout');
        onLogout();
        navigate('/');
      }, countdownLimit);
    } else {
      expirationTimerRef.current = setTimeout(() => {
        setShowWarning(true);

        countdownTimerRef.current = setTimeout(() => {
          sessionStorage.removeItem('intentionalLogout');
          onLogout();
          navigate('/');
        }, countdownLimit);
      }, timeUntilWarning);
    }
  }, [countdownLimit, onLogout, navigate]);

  const resetAllTimers = useCallback(() => {
    clearAllTimers();

    startInactivityTimer();
    startExpirationTimer();
  }, [clearAllTimers, startInactivityTimer, startExpirationTimer]);

  const resetInactivityTimer = useCallback(() => {
    if (showWarning) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      startInactivityTimer();

      const token = localStorage.getItem('token');
      const expiration = token ? getTokenExpirationTime(token) : null;

      if (expiration && expiration - Date.now() <= 2 * 60 * 1000) {
        onExtendSession();
      }
    }, 500);
  }, [startInactivityTimer, showWarning, onExtendSession]);

  const acknowledgeActivity = (): void => {
    setShowWarning(false);
    onExtendSession();
    resetAllTimers();
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer, { passive: true });
    window.addEventListener('wheel', resetInactivityTimer, { passive: true });
    window.addEventListener('touchmove', resetInactivityTimer, { passive: true });

    resetAllTimers();

    return () => {
      clearAllTimers();
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('wheel', resetInactivityTimer);
      window.removeEventListener('touchmove', resetInactivityTimer);
    };
  }, [resetAllTimers, clearAllTimers, resetInactivityTimer]);

  return {
    showWarning,
    acknowledgeActivity,
  };
};
