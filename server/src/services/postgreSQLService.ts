import pkg from 'pg';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const saveToPostgreSQL = async (
  fileHash: string,
  extractedText: string,
  userId: string,
  resumeData: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    portfolio?: string;
    summary?: string;
    experience?: { company: string; role: string; start_date: string; end_date: string; responsibilities: string[] }[];
    education?: { institution: string; degree: string; graduation_year: string }[];
    skills?: string[];
    certifications?: { name: string; year: string }[];
  }
): Promise<{ success: boolean; message: string }> => {
  if (!userId || !uuidValidate(userId)) {
    return { success: false, message: `Invalid UUID for user_id: ${userId}` };
  }

  try {
    const userCheckResult = await pool.query('SELECT id FROM "Users" WHERE id = $1', [userId]);
    if (userCheckResult.rowCount === 0) {
      return { success: false, message: `User with ID ${userId} does not exist.` };
    }

    const resumeContent = extractedText || (process.env.NODE_ENV !== "production" ? "Placeholder resume content" : null);
    if (!resumeContent) {
      return { success: false, message: "Resume content is empty." };
    }

    const resumeId = uuidv4();
    const title = resumeData.name ?? "Untitled Resume";

    const insertQuery = `
        INSERT INTO "Resumes" (
            id, file_hash, extracted_text, user_id,
            content, title, experience, education, skills, certifications,
            email, phone, linkedin, portfolio, updated_at
        )
        VALUES (
                   $1, $2, $3, $4,
                   $5, $6, $7::JSONB, $8::JSONB, $9::JSONB, $10::JSONB,
                   $11, $12, $13, $14, NOW()
               )
        RETURNING id;
    `;

    const insertResult = await pool.query(insertQuery, [
      resumeId,
      fileHash,
      extractedText,
      userId,
      resumeContent,
      title,
      JSON.stringify(resumeData.experience ?? []),
      JSON.stringify(resumeData.education ?? []),
      JSON.stringify(resumeData.skills ?? []),
      JSON.stringify(resumeData.certifications ?? []),
      resumeData.email ?? "",
      resumeData.phone ?? "",
      resumeData.linkedin ?? "",
      resumeData.portfolio ?? ""
    ]);

    if (insertResult.rowCount === 0) {
      return { success: false, message: "Failed to insert resume into database." };
    }

    return { success: true, message: "Resume saved successfully." };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error saving resume to PostgreSQL:", error.message);
    } else {
      console.error("Error saving resume to PostgreSQL:", String(error));
    }
    return { success: false, message: "An error occurred while saving the resume. Please try again." };
  }
};

export const getFromPostgreSQL = async (fileHash: string): Promise<string | null> => {
  const result = await pool.query('SELECT extracted_text FROM "Resumes" WHERE file_hash = $1', [fileHash]);
  return result.rows.length ? result.rows[0].extracted_text : null;
};
