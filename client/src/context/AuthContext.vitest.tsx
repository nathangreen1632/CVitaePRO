import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { AuthProvider, AuthContext, AuthContextType } from "./AuthContext.tsx";
import React from "react";
import { MemoryRouter } from "react-router-dom";  // <-- Required!

// Helper consumer to access context
const TestComponent = () => {
  const context = React.useContext(AuthContext) as AuthContextType;

  if (!context) return <div>Context Not Found</div>;

  const handleLogin = async () => await context.login("user1", "password123");
  const handleRegister = async () => await context.register("user2", "password456");
  const handleLogout = () => context.logout();

  return (
    <div>
      <div data-testid="user">{context.user}</div>
      <div data-testid="token">{context.token}</div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe("AuthProvider Context", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set token and user on successful login", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "abc123" }),
      })
    ));

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("user1");
      expect(screen.getByTestId("token").textContent).toBe("abc123");
      expect(localStorage.getItem("token")).toBe("abc123");
      expect(localStorage.getItem("user")).toBe("user1");
    });
  });

  it("should set token and user on successful register", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "def456" }),
      })
    ));

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("user2");
      expect(screen.getByTestId("token").textContent).toBe("def456");
      expect(localStorage.getItem("token")).toBe("def456");
      expect(localStorage.getItem("user")).toBe("user2");
    });
  });

  it("should clear token and user on logout", async () => {
    localStorage.setItem("token", "existingToken");
    localStorage.setItem("user", "existingUser");

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("");
      expect(screen.getByTestId("token").textContent).toBe("");
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  it("should restore user and token from localStorage on load", () => {
    localStorage.setItem("token", "restoredToken");
    localStorage.setItem("user", "restoredUser");

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("user").textContent).toBe("restoredUser");
    expect(screen.getByTestId("token").textContent).toBe("restoredToken");
  });
});
