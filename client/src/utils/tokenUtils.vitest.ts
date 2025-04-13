import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTokenExpirationTime } from "./tokenUtils";

describe("getTokenExpirationTime", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const createJWT = (payload: object) => {
    const base64Header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = "signature"; // Doesn't matter for decoding
    return `${base64Header}.${base64Payload}.${signature}`;
  };

  it("returns expiration time in milliseconds if exp exists", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const token = createJWT({ exp });

    const result = getTokenExpirationTime(token);

    expect(result).toBe(exp * 1000);
  });

  it("returns null if token has no exp field", () => {
    const token = createJWT({ username: "test" });

    const result = getTokenExpirationTime(token);

    expect(result).toBeNull();
  });

  it("returns null and logs error if token is malformed", () => {
    const badToken = "invalid.token.value";

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = getTokenExpirationTime(badToken);

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      "❌ Failed to decode token:",
      expect.any(Error)
    );
  });

  it("returns null if payload is not an object", () => {
    const badPayload = btoa("not a json object");
    const token = `header.${badPayload}.signature`;

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = getTokenExpirationTime(token);

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      "❌ Failed to decode token:",
      expect.any(Error)
    );
  });
});
