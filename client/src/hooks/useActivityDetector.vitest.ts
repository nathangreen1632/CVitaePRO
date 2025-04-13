import { renderHook, act } from "@testing-library/react";
import { useActivityDetector } from "./useActivityDetector";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as tokenUtils from "../utils/tokenUtils";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const flushAllTimersAndTasks = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
    await Promise.resolve();
  });
};

describe("useActivityDetector", () => {
  let mockLogout: ReturnType<typeof vi.fn>;
  let mockExtendSession: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLogout = vi.fn();
    mockExtendSession = vi.fn();
    localStorage.setItem("token", "mock.token.value");

    vi.spyOn(tokenUtils, "getTokenExpirationTime").mockReturnValue(
      Date.now() + 30 * 60 * 1000
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
    vi.clearAllTimers();
    localStorage.clear();
  });

  it("should not show warning initially", () => {
    const { result } = renderHook(() =>
      useActivityDetector({
        onLogout: mockLogout,
        onExtendSession: mockExtendSession,
        inactiveLimit: 5000,
        countdownLimit: 3000,
      })
    );

    expect(result.current.showWarning).toBe(false);
  });

  it("should show warning and logout after inactivity timeout", async () => {
    const { result } = renderHook(() =>
      useActivityDetector({
        onLogout: mockLogout,
        onExtendSession: mockExtendSession,
        inactiveLimit: 1000,
        countdownLimit: 1000,
      })
    );

    // Trigger inactivity limit
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });

    expect(result.current.showWarning).toBe(true);

    // Trigger countdown limit
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Force all pending timers to run
    await flushAllTimersAndTasks();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should reset timers when activity is detected and extend session if near expiry", async () => {
    vi.spyOn(tokenUtils, "getTokenExpirationTime").mockReturnValue(
      Date.now() + 60 * 1000 // < 2min
    );

    const { result } = renderHook(() =>
      useActivityDetector({
        onLogout: mockLogout,
        onExtendSession: mockExtendSession,
        inactiveLimit: 1000,
        countdownLimit: 1000,
      })
    );

    act(() => {
      result.current.acknowledgeActivity();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500); // debounce
    });

    await flushAllTimersAndTasks();

    expect(mockExtendSession).toHaveBeenCalledTimes(1);
  });

  it("should reset timers and hide warning when acknowledgeActivity is called", async () => {
    const { result } = renderHook(() =>
      useActivityDetector({
        onLogout: mockLogout,
        onExtendSession: mockExtendSession,
        inactiveLimit: 1000,
        countdownLimit: 1000,
      })
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000); // show warning
    });

    expect(result.current.showWarning).toBe(true);

    act(() => {
      result.current.acknowledgeActivity();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500); // debounce
    });

    await flushAllTimersAndTasks();

    expect(result.current.showWarning).toBe(false);
  });

  it("should only check token expiration during activity reset", async () => {
    const expirationSpy = vi.spyOn(tokenUtils, "getTokenExpirationTime");

    const { result } = renderHook(() =>
      useActivityDetector({
        onLogout: mockLogout,
        onExtendSession: mockExtendSession,
        inactiveLimit: 1000,
        countdownLimit: 1000,
      })
    );

    act(() => {
      result.current.acknowledgeActivity();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500); // debounce
    });

    await flushAllTimersAndTasks();

    expect(expirationSpy).toHaveBeenCalled();
  });
});
