import fetch from "node-fetch";
import dotenv from "dotenv";
import logger from "../register/logger.js";

dotenv.config();

const OPENAI_API_URL: string = process.env.OPENAI_URL ?? '';
const OPENAI_API_KEY: string = process.env.OPENAI_KEY ?? '';

export async function callOpenAI(p0: { model: string; messages: { role: string; content: string; }[]; }): Promise<{ success: boolean; message: string }> {
  try {
    // Validate API URL before making the request
    if (!OPENAI_API_URL) {
      logger.error("❌ Error: OPENAI_API_URL is missing in .env file.");
      return { success: false, message: "Server misconfiguration: Missing OpenAI API URL." };
    }
    if (!OPENAI_API_KEY) {
      logger.error("❌ Error: OPENAI_API_KEY is missing in .env file.");
      return { success: false, message: "Server misconfiguration: Missing OpenAI API Key." };
    }

    const requestPayload = {
        model: p0.model,
        messages: p0.messages,
        temperature: 0.7
    };

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      return {
        success: false,
        message: `OpenAI API Error: ${response.status} ${response.statusText}`
      };
    }

    const jsonResponse = await response.json();
    return {
      success: true,
      message: jsonResponse.choices[0]?.message?.content || "Error: No valid response from OpenAI"
    };
  } catch (error) {
    logger.error("Error enhancing resume:", error);
    return {
      success: false,
      message: "An unexpected error occurred while enhancing the resume. Please try again later."
    };
  }
}
