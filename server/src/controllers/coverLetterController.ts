import { callOpenAI } from "../utils/openaiUtil.js";
import { coverLetterPrompt, userCoverLetterDirections } from "../prompts/coverLetterDirections.js";

export const generateCoverLetter = async (userData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const { userInput, applicantDetails, resumeSummary, customizationPreferences } = userData;

    const messages = [
      { role: "system", content: coverLetterPrompt },
      {
        role: "user",
        content: `${userCoverLetterDirections}
        
        - Job Title: ${userInput.jobTitle}
        - Company: ${userInput.companyName}
        
        - Applicant Name: ${applicantDetails.name}
        - Contact Info: Email - ${applicantDetails.email}, Phone - ${applicantDetails.phone}, LinkedIn - ${applicantDetails.linkedin}, Portfolio - ${applicantDetails.portfolio}

        - Resume Summary: ${resumeSummary.summary}
        - Experience: ${JSON.stringify(resumeSummary.experience, null, 2)}
        - Education: ${JSON.stringify(resumeSummary.education, null, 2)}
        - Skills: ${resumeSummary.skills.join(", ")}
        - Certifications: ${JSON.stringify(resumeSummary.certifications, null, 2)}

        - Customization Preferences: ${customizationPreferences.tone}, ${customizationPreferences.length}, Focus Areas: ${customizationPreferences.focusAreas.join(", ")}
        `
      }
    ];

    const aiResponse = await callOpenAI({
      model: "gpt-4o",
      messages,
    });

    if (!aiResponse) {
      throw new Error("Failed to generate cover letter");
    }

    return aiResponse;
  } catch (error) {
    console.error("Cover Letter Generation Error:", error);
    throw new Error("Internal server error");
  }
};
