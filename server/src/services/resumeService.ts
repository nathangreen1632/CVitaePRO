export const generateResume = async (formData: { jobTitle: string; experience: string }) => {
  try {
    console.log("Preparing request for OpenAI with data:", formData); // Debug log

    const response = await fetch("/api/generateResume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: JSON.stringify(formData) // ✅ Convert object to string
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from API:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Generated Resume:", data);
    return data;
  } catch (error) {
    console.error("Request failed:", error);
  }
};
