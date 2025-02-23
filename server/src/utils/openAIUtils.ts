import 'dotenv/config';

const OPENAI_KEY: string = process.env.OPENAI_KEY ?? '';
const OPENAI_URL: string = process.env.OPENAI_URL ?? '';

if (!OPENAI_KEY || !OPENAI_URL) {
  throw new Error("Missing OpenAI API credentials in environment variables.");
}

export const callOpenAI = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error('OpenAI Request Failed:', error);
    return null;
  }
};
