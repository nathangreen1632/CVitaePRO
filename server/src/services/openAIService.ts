import fetch, { Response } from "node-fetch";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

const CVITAEPRO_API_KEY: string | undefined = process.env.CVITAEPRO_API_KEY;
const CVITAEPRO_URL: string = process.env.CVITAEPRO_URL ?? "https://api.openai.com/v1/chat/completions";

if (!CVITAEPRO_API_KEY) {
  throw new Error("❌ OpenAI API key is missing. Check your environment variables.");
}

const resumePrompt: string = `
You are an expert resume writing assistant specializing in crafting ATS-friendly resumes. Your goal is to generate clear, concise, and professional resumes that effectively highlight a candidate's skills, experience, and achievements while ensuring compatibility with Applicant Tracking Systems (ATS).

Follow these best practices:
- Use standard resume sections (e.g., Summary, Skills, Experience, Education).
- Format text with simple, ATS-readable fonts (e.g., Arial, Calibri).
- Avoid tables, images, and unnecessary special characters.
- Use keywords relevant to the job description to optimize ATS rankings.
- Ensure bullet points are clear, action-oriented, and measurable.
- Avoid excessive abbreviations and industry jargon unless commonly recognized.
- Prioritize clarity, readability, and a professional tone.

`;

const coverLetterPrompt: string = `
You are a professional cover letter assistant. Your goal is to create well-structured, compelling, and job-specific cover letters that effectively communicate the candidate’s strengths, experiences, and enthusiasm for the role.

Follow these guidelines:
- Address the hiring manager by name if provided, otherwise use a neutral greeting.
- Highlight key skills and experiences relevant to the job posting.
- Keep the tone professional yet engaging.
- Avoid generic phrases and focus on personalization.
- Use a clear structure: Introduction, Skills & Achievements, Enthusiasm for the Role, and a Strong Closing.
`;

async function generateOpenAIResponse(prompt: string, userContent: string): Promise<string | null> {
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
          { role: "system", content: prompt },
          { role: "user", content: userContent },
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
  return generateOpenAIResponse(coverLetterPrompt, jobDetails);
};
