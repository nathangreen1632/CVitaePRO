import fetch from "node-fetch";
import { OPENAI_KEY, OPENAI_URL } from "../config/env.js";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
import { coverLetterPrompt, userCoverLetterDirections } from "../prompts/coverLetterDirections.js";

/**
 * Calls OpenAI to generate Cover Letters or Resumes.
 * @param {string} type - "coverLetter" or "resume"
 * @param {string | object} content - Text for cover letter OR JSON for resume
 * @returns {Promise<string>} - Generated response from OpenAI
 */
export const generateFromOpenAI = async (
  type: "coverLetter" | "resume",
  content: string | object
): Promise<string> => {
  try {
    const requestBody = {
      model: "gpt-4o",
      messages: [
        type === "resume"
          ? { role: "system", content: resumePrompt }
          : { role: "system", content: coverLetterPrompt },
        type === "resume"
          ? { role: "user", content: `${userResumeDirections}\n\n${JSON.stringify(content)}` }
          : { role: "user", content: `${userCoverLetterDirections}\n\n${content as string}` },
      ],
    };

    console.log(`Sending ${type} request to OpenAI:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log(`Received ${type} response from OpenAI:`, JSON.stringify(data, null, 2));

    if (!data.choices[0].message || !data.choices[0] || !data.choices) {
      throw new Error(`Invalid OpenAI response for ${type}`);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error generating ${type}:`, error);
    throw new Error(`Failed to generate ${type}`);
  }
};









// /**
//  * Generates a personalized cover letter based on the user's resume and job description.
//  * @param coverLetterData - The structured JSON object containing resume details and job description.
//  * @returns The AI-generated cover letter.
//  */
// export const generateCoverLetter = async (coverLetterData: any): Promise<string> => {
//   const { jobDescription, applicantDetails, resumeSummary, customizationPreferences } = coverLetterData;
//
//   const formattedCoverLetterInput = `
//     Job Title: ${jobDescription.jobTitle}
//     Company: ${jobDescription.companyName}
//     Job Description: ${jobDescription.jobDescription}
//
//     Applicant Name: ${applicantDetails.name}
//     Contact Email: ${applicantDetails.email}
//     LinkedIn: ${applicantDetails.linkedin}
//     Portfolio: ${applicantDetails.portfolio}
//
//     Resume Summary: ${resumeSummary.summary}
//     Experience:
//     ${resumeSummary.experience.map((exp: { role: string; company: string; start_date: string; end_date: string; }) => `- ${exp.role} at ${exp.company} (${exp.start_date} - ${exp.end_date})`).join("\n")}
//
//     Skills: ${resumeSummary.skills.join(", ")}
//
//     Preferences:
//     - Tone: ${customizationPreferences.tone}
//     - Length: ${customizationPreferences.length}
//     - Focus Areas: ${customizationPreferences.focusAreas.join(", ")}
//   `;
//
//   const messages = [
//     { role: "system", content: "You are an AI that generates professional cover letters based on user input." },
//     { role: "user", content: `Generate a cover letter based on the following details:\n${formattedCoverLetterInput}` },
//   ];
//
//   return sendToOpenAI(messages);
// };
