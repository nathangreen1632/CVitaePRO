import { callOpenAI } from "../utils/openAIService.js";
import { coverLetterPrompt } from "../prompts/coverLetterDirections.js";

export const generateCoverLetter = async (): Promise<string> => {
  try {
    const aiResponse = await callOpenAI({
      model: "gpt-4o",
      messages: [{ role: "system", content: coverLetterPrompt }],
    });

    if (!aiResponse) {
      throw new Error("Failed to generate cover letter"); // ✅ Throw error instead of sending res.json()
    }

    return aiResponse; // ✅ Return generated cover letter
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw new Error("Internal server error");
  }
};
