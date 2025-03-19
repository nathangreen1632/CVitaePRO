export const buildFallbackResume = (inputData: any): Record<string, any> => ({
  name: inputData.name || "",
  email: inputData.email || "",
  phone: inputData.phone || "",
  linkedin: inputData.linkedin || "",
  portfolio: inputData.portfolio || "",
  summary: inputData.summary || "No summary provided.",
  experience: inputData.experience || [],
  education: inputData.education || [],
  skills: inputData.skills || ["No skills listed."],
  certifications: inputData.certifications || ["No certifications listed."]
});
