import fetch from "node-fetch";
import { OPENAI_KEY, OPENAI_URL } from "../config/env.js";
import { resumePrompt, userResumeDirections } from "../prompts/resumeDirections.js";
import { coverLetterPrompt, userCoverLetterDirections } from "../prompts/coverLetterDirections.js";

/**
 * Calls OpenAI to generate Cover Letters or Resumes.
 * @param {string} type - "coverLetter" or "resume"
 * @param {string | object} content - JSON for resume OR structured input for cover letter
 * @returns {Promise<{ success: boolean; message: string }>} - Generated response from OpenAI
 */
export const generateFromOpenAI = async (
  type: "coverLetter" | "resume",
  content: any
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("🟡 Received request for OpenAI:", { type, content });

    // ✅ Ensure content is correctly formatted
    if (!content || typeof content !== "object") {
      console.error("❌ Invalid content sent to OpenAI:", content);
      return { success: false, message: "Invalid request. Content must be a valid object." };
    }

    // ✅ Extract required properties for cover letter
    let userInput, applicantDetails, resumeSummary;
    if (type === "coverLetter") {
      userInput = content?.userInput;
      applicantDetails = content?.applicantDetails;
      resumeSummary = content?.resumeSummary;

      console.log("🟢 Extracted userInput:", JSON.stringify(userInput, null, 2));

      if (!userInput?.jobTitle || !userInput?.companyName) {
        console.error("❌ Missing jobTitle or companyName in userInput:", userInput);
        return { success: false, message: "Job title and company name are required for cover letter generation." };
      }

      if (!applicantDetails?.name) {
        console.error("❌ Missing applicant name in applicantDetails:", applicantDetails);
        return { success: false, message: "Applicant name is required for cover letter generation." };
      }

      if (!resumeSummary?.summary) {
        console.error("❌ Missing resume summary in resumeSummary:", resumeSummary);
        return { success: false, message: "Resume summary is required for cover letter generation." };
      }
    }

    // ✅ Structuring the prompt to **force OpenAI to replace placeholders**
    const userMessage = type === "resume"
      ? `${userResumeDirections}\n\n${JSON.stringify(content)}`
      : `
        ${userCoverLetterDirections}

        **Applicant Details (Insert at the Top & Bottom of the Cover Letter)**  
        - Applicant Name: ${applicantDetails.name}  
        - Email: ${applicantDetails.email}  
        - Phone: ${applicantDetails.phone}  
        - Address: ${applicantDetails.yourAddress}  
        - LinkedIn: ${applicantDetails.linkedin}  
        - Portfolio: ${applicantDetails.portfolio}  

        **Date Formatting Requirement:**  
        - If possible, insert the current date at the **top of the cover letter**.
        - If OpenAI cannot determine the actual date, leave it out entirely. Do **not** insert placeholders like "[Date]".

        **Recipient & Job Details (Used in Salutation & Body):**  
        - Hiring Manager Name: ${userInput.hiringManagerName}  
        - Company Name: ${userInput.companyName}  
        - Company Address: ${userInput.companyAddress}  
        - Job Title: ${userInput.jobTitle}  
        - Job Description: ${userInput.jobDescription}  

        **Resume Summary:**  
        ${resumeSummary.summary}  

        **Work Experience:**  
        ${resumeSummary.experience.map((exp: { role: string; company: string; start_date: string; end_date: string }) => `- ${exp.role} at ${exp.company} (${exp.start_date} - ${exp.end_date})`).join("\n")}

        **Education:**  
        ${resumeSummary.education.map((edu: { degree: string; institution: string; graduation_year: string }) => `- ${edu.degree} from ${edu.institution} (${edu.graduation_year})`).join("\n")}

        **Skills:**  
        ${resumeSummary.skills.join(", ")}  

        **Certifications:**  
        ${resumeSummary.certifications.map((cert: { name: string; year: number }) => `- ${cert.name} (${cert.year})`).join("\n")}  

        **Customization Preferences:**  
        - Tone: ${content.customizationPreferences.tone}  
        - Length: ${content.customizationPreferences.length}  
        - Focus Areas: ${content.customizationPreferences.focusAreas.join(", ")}  

        **Important Instructions:**  
        1️⃣ **The applicant details must be included at the top of the cover letter in this format:**  
        - Applicant Name: ${applicantDetails.name}  
        - Email: ${applicantDetails.email}  
        - Phone: ${applicantDetails.phone}  
        - Address: ${applicantDetails.yourAddress}  
        - LinkedIn: ${applicantDetails.linkedin}  
        - Portfolio: ${applicantDetails.portfolio}   

        2️⃣ **The date should appear right below the applicant's details ONLY if OpenAI can generate an accurate one.**  
        3️⃣ **The closing statement must include the applicant details in the same format.**  
        4️⃣ **DO NOT insert placeholders like "[Your Name]" or "[Date]". Always use real values.**  
      `;

    const requestBody = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: type === "resume" ? resumePrompt : coverLetterPrompt },
        { role: "user", content: userMessage },
      ],
    };

    console.log("🟢 RequestBody Ready:", JSON.stringify(requestBody, null, 2));

    // ✅ Send request to OpenAI API
    const openAiResponse = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const jsonResponse = await openAiResponse.json();
    console.log("🔵 OpenAI Response:", JSON.stringify(jsonResponse, null, 2));

    if (!openAiResponse.ok) {
      console.error("❌ OpenAI API Error:", jsonResponse);
      return { success: false, message: `OpenAI API Error: ${openAiResponse.status} ${JSON.stringify(jsonResponse)}` };
    }

    return { success: true, message: jsonResponse.choices?.[0]?.message?.content || "Error: No valid response from OpenAI" };
  } catch (error) {
    console.error("❌ Unexpected Error in generateFromOpenAI:", error);
    return { success: false, message: "Failed to generate cover letter due to an internal error." };
  }
};
