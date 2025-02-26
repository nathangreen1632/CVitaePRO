import fetch from "node-fetch";
import { OpenAIResponse, OpenAIRequest } from "../types/openAITypes.js";
import { OPENAI_URL, OPENAI_KEY } from "../config/env.js";

/**
 * Sends a request to OpenAI's API
 * @param {OpenAIRequest} requestData - The request object
 * @returns {Promise<string>} - The AI-generated response
 */
export async function callOpenAI(requestData: OpenAIRequest): Promise<string> {
  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "An error occurred processing your request.";
  }
}
