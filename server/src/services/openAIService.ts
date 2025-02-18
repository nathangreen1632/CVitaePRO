import fetch, { Response } from 'node-fetch';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const CVITAEPRO_API_KEY: string | undefined = process.env.CVITAEPRO_API_KEY;
const CVITAEPRO_URL: string = process.env.CVITAEPRO_URL ?? 'https://api.openai.com/v1/chat/completions';

if (!CVITAEPRO_API_KEY) {
  throw new Error("❌ OpenAI API key is missing. Check your environment variables.");
}

const myPrompt: string = 'You are an expert resume writing assistant specializing in crafting ATS-friendly resumes. Your goal is to generate clear, concise, and professional resumes that effectively highlight a candidate\'s skills, experience, and achievements while ensuring compatibility with Applicant Tracking Systems (ATS).\n' +
  '\n' +
  'Follow these best practices:\n' +
  '\n' +
  'Use standard resume sections (e.g., Summary, Skills, Experience, Education).\n' +
  'Format text with simple, ATS-readable fonts (e.g., Arial, Calibri).\n' +
  'Avoid tables, images, and unnecessary special characters.\n' +
  'Use keywords relevant to the job description to optimize ATS rankings.\n' +
  'Ensure bullet points are clear, action-oriented, and measurable.\n' +
  'Avoid excessive abbreviations and industry jargon unless commonly recognized.\n' +
  'When generating content, prioritize clarity, readability, and professional tone while making the resume engaging and tailored to the target role.'


export const generateResume = async (prompt: string): Promise<string | null> => {
  try {
    console.log('🔍 Sending request to OpenAI API...');

    const response: Response = await fetch(CVITAEPRO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CVITAEPRO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: myPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error(`❌ OpenAI API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('🔍 Full Response:', errorText);
      return null;
    }

    const data: any = await response.json();
    console.log('✅ OpenAI Response:', JSON.stringify(data, null, 2));

    return data.choices[0]?.message?.content.trim() || null;
  } catch (error) {
    console.error('❌ Error generating resume:', error);
    return null;
  }
};
