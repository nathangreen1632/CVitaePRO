import { vi, describe, it, expect, beforeEach } from "vitest";
import { refreshToken } from "./refreshToken";

describe("refreshToken", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("returns true and updates token on successful refresh", async () => {
    localStorage.setItem("token", "old-token");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "new-token" }),
    }));

    const result = await refreshToken();

    expect(result).toBe(true);
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("returns false if no token in localStorage", async () => {
    const result = await refreshToken();
    expect(result).toBe(false);
  });

  it("returns false if fetch fails with bad response", async () => {
    localStorage.setItem("token", "some-token");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    }));

    const result = await refreshToken();
    expect(result).toBe(false);
  });

  it("returns false if fetch succeeds but no token is returned", async () => {
    localStorage.setItem("token", "some-token");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    }));

    const result = await refreshToken();
    expect(result).toBe(false);
  });

  it("returns false and logs error if fetch throws", async () => {
    localStorage.setItem("token", "some-token");

    // Spy on console.error to suppress error logging and verify output
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

    const result = await refreshToken();
    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith("❌ Error refreshing token:", expect.any(Error));
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });
});
