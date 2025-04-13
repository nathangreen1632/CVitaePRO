import React from "react";
import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth.ts";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import { vi } from "vitest";

describe("useAuth", () => {
  const mockAuthContext: AuthContextType = {
    user: "testuser",
    token: "mock-token-abc123",
    login: vi.fn().mockResolvedValue(true),
    register: vi.fn().mockResolvedValue({ success: true, token: "mock-token-abc123" }),
    logout: vi.fn(),
  };

  it("returns defaultAuth when no AuthContext is provided", async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();

    const loginResult = await result.current.login("someone", "password123");
    const registerResult = await result.current.register("someone", "password123");

    expect(loginResult).toBe(false);
    expect(registerResult).toEqual({ success: false });
  });

  it("returns values from AuthContext when provider is present", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockAuthContext}>
        {children}
        </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBe("testuser");
    expect(result.current.token).toBe("mock-token-abc123");
    expect(result.current.login).toBe(mockAuthContext.login);
    expect(result.current.register).toBe(mockAuthContext.register);
    expect(result.current.logout).toBe(mockAuthContext.logout);
  });
});
