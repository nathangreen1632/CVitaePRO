export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp === "number") {
      return payload.exp * 1000; // convert seconds to ms
    }
    return null;
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return null;
  }
};
