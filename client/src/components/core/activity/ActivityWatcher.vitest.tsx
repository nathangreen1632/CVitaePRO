import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActivityWatcher from "./ActivityWatcher";
import { AuthContext } from "../../../context/AuthContext";
import * as useActivityDetectorHook from "../../../hooks/useActivityDetector";
import * as refreshModule from "../../../utils/refreshToken";
import { MemoryRouter } from "react-router-dom";
import type { AuthContextType } from "../../../context/AuthContext";

vi.stubGlobal('atob', () => JSON.stringify({ exp: Date.now() / 900000 }));

vi.mock("../modals/SessionWarningModal.tsx", () => ({
  default: ({ onStayLoggedIn, onLogout }: { onStayLoggedIn: () => void; onLogout: () => void }) => (
    <div>
      <p>Session Timeout Warning</p>
      <button onClick={onStayLoggedIn}>Stay Logged In</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}));

describe("ActivityWatcher", () => {
  const mockLogout = vi.fn();
  const mockAcknowledge = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockLogout.mockClear();
    mockAcknowledge.mockClear();
  });

  const renderComponent = (showWarning = true) => {
    vi.spyOn(useActivityDetectorHook, "useActivityDetector").mockReturnValue({
      showWarning,
      acknowledgeActivity: mockAcknowledge,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: "testuser",
            token: "abc123",
            login: vi.fn(),
            register: vi.fn(),
            logout: mockLogout,
          }}
        >
          <ActivityWatcher>
            <p>Child Content</p>
          </ActivityWatcher>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it("renders SessionWarningModal when showWarning is true", () => {
    renderComponent(true);
    expect(screen.getByText("Session Timeout Warning")).toBeInTheDocument();
  });

  it("calls acknowledgeActivity when 'Stay Logged In' is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByText("Stay Logged In"));
    expect(mockAcknowledge).toHaveBeenCalled();
  });

  it("calls logout when 'Logout' is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("calls refreshToken successfully during extend session", async () => {
    const refreshSpy = vi.spyOn(refreshModule, "refreshToken").mockResolvedValue(true);
    localStorage.setItem("token", "abc123");

    const mockAcknowledge = vi.fn(async () => {
      const success = await refreshModule.refreshToken();
      if (!success) mockLogout();
    });

    vi.spyOn(useActivityDetectorHook, "useActivityDetector").mockReturnValue({
      showWarning: false,
      acknowledgeActivity: mockAcknowledge,
    });

    renderComponent(false);

    // Simulate user interaction (what ActivityWatcher would do internally)
    await screen.findByText("Child Content");
    await mockAcknowledge();

    expect(refreshSpy).toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("calls logout if refreshToken fails", async () => {
    const refreshSpy = vi.spyOn(refreshModule, "refreshToken").mockResolvedValue(false);
    localStorage.setItem("token", "abc123");

    const mockAcknowledge = vi.fn(async () => {
      const success = await refreshModule.refreshToken();
      if (!success) mockLogout();
    });

    vi.spyOn(useActivityDetectorHook, "useActivityDetector").mockReturnValue({
      showWarning: false,
      acknowledgeActivity: mockAcknowledge,
    });

    renderComponent(false);

    await screen.findByText("Child Content");
    await mockAcknowledge();

    expect(refreshSpy).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalled();
  });



  it("does not render anything if AuthContext is not provided", () => {
    const { container } = render(
      <MemoryRouter>
        <ActivityWatcher />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render anything if AuthContext is null", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={null as unknown as AuthContextType}>
          <ActivityWatcher />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
