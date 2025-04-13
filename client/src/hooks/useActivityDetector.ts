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
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const startInactivityTimer = useCallback(() => {
    clearAllTimers();

    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true);

      countdownTimerRef.current = setTimeout(() => {
        sessionStorage.removeItem('intentionalLogout');
        onLogout();
        navigate('/');
      }, countdownLimit);
    }, inactiveLimit);
  }, [clearAllTimers, inactiveLimit, countdownLimit, onLogout, navigate]);

  const resetInactivityTimer = useCallback(() => {
    if (showWarning) return;

    clearAllTimers();

    debounceRef.current = setTimeout(() => {
      startInactivityTimer();

      const token = localStorage.getItem('token');
      const expiration = token ? getTokenExpirationTime(token) : null;

      if (expiration && expiration - Date.now() <= 2 * 60 * 1000) {
        onExtendSession();
      }
    }, 500);
  }, [clearAllTimers, showWarning, startInactivityTimer, onExtendSession]);

  const acknowledgeActivity = (): void => {
    setShowWarning(false);
    resetInactivityTimer();
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer, { passive: true });
    window.addEventListener('wheel', resetInactivityTimer, { passive: true });
    window.addEventListener('touchmove', resetInactivityTimer, { passive: true });

    startInactivityTimer();

    return () => {
      clearAllTimers();
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('wheel', resetInactivityTimer);
      window.removeEventListener('touchmove', resetInactivityTimer);
    };
  }, [resetInactivityTimer, clearAllTimers, startInactivityTimer]);

  return {
    showWarning,
    acknowledgeActivity,
  };
};
