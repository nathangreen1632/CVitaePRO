import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./AuthContext";
import { useContext } from "react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let testContext: AuthContextType;

function renderWithAuthContext() {
  function TestComponent() {
    const ctx = useContext(AuthContext);
    if (ctx) testContext = ctx;
    return <div>Test</div>;
  }

  render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem("user", "hydratedUser");
    localStorage.setItem("token", "abc123");

    renderWithAuthContext();

    expect(testContext.user).toBe("hydratedUser");
    expect(testContext.token).toBe("abc123");
  });

  it("logs in and sets state + localStorage", async () => {
    const fakeResponse = {
      ok: true,
      json: () => Promise.resolve({ username: "testUser", token: "tok123" }),
    };
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(fakeResponse)));

    renderWithAuthContext();

    await act(async () => {
      const success = await testContext.login("testUser", "pass123");
      expect(success).toBe(true);
    });

    expect(testContext.user).toBe("testUser");
    expect(testContext.token).toBe("tok123");
    expect(localStorage.getItem("user")).toBe("testUser");
    expect(localStorage.getItem("token")).toBe("tok123");
  });

  it("registers and returns success object", async () => {
    const fakeResponse = {
      ok: true,
      json: () => Promise.resolve({ token: "newToken" }),
    };
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(fakeResponse)));

    renderWithAuthContext();

    let result;
    await act(async () => {
      result = await testContext.register("newUser", "newPass");
    });

    expect(result).toEqual({ success: true, token: "newToken" });
  });

  it("logs out, clears state + localStorage, and navigates home", () => {
    localStorage.setItem("user", "loggedUser");
    localStorage.setItem("token", "t0k");

    renderWithAuthContext();

    act(() => {
      testContext.logout();
    });

    expect(testContext.user).toBe(null);
    expect(testContext.token).toBe(null);
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
