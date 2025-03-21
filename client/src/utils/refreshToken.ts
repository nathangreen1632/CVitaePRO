export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ No token in localStorage — cannot refresh");
      return false;
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("❌ Failed to refresh token: Bad response");
      return false;
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      return true;
    }

    console.warn("⚠️ No token returned from refresh endpoint");
    return false;
  } catch (err) {
    console.error("❌ Error refreshing token:", err);
    return false;
  }
};
