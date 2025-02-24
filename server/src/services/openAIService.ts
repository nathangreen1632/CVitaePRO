import fetch, { Response } from "node-fetch";
import dotenv from "dotenv";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
// Ensure environment variables are loaded
dotenv.config();

const CVITAEPRO_API_KEY: string | undefined = process.env.OPENAI_KEY;
const CVITAEPRO_URL: string = process.env.OPENAI_URL ?? "https://api.openai.com/v1/chat/completions";

if (!CVITAEPRO_API_KEY) {
  throw new Error("❌ OpenAI API key is missing. Check your environment variables.");
}

async function generateOpenAIResponse(resumePrompt: string, userResumeDirections: string): Promise<string | null> {
  try {
    console.log("🔍 Sending request to OpenAI API...");

    const response: Response = await fetch(CVITAEPRO_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CVITAEPRO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: resumePrompt },
          { role: "user", content: userResumeDirections },
        ],
        temperature: 0.5,
        max_tokens: 10000,
      }),
    });

    if (!response.ok) {
      console.error(`❌ OpenAI API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("🔍 Full Response:", errorText);
      return null;
    }

    const data: any = await response.json();
    console.log("✅ OpenAI Response:", JSON.stringify(data, null, 2));

    return data.choices[0]?.message?.content.trim() || null;
  } catch (error) {
    console.error("❌ Error generating OpenAI response:", error);
    return null;
  }
}

export const enhanceResumeService = async (resumeText: string): Promise<string | null> => {
  return generateOpenAIResponse(resumePrompt, resumeText);
};

export const generateCoverLetterService = async (jobDetails: string): Promise<string | null> => {
  return generateOpenAIResponse(userResumeDirections, jobDetails);
};
