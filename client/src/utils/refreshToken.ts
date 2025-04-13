export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
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
      return false;
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      return true;
    }
    return false;
  } catch (err) {
    console.error("❌ Error refreshing token:", err);
    return false;
  }
};
