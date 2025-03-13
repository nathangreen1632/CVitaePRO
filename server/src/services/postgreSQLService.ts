// ‼️Rerun Database Migration after updating this file‼️

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
  console.log("🛠 Debug: Entering saveToPostgreSQL...");
  console.log("📌 Debug: userId received in saveToPostgreSQL:", userId);

  if (!userId || !uuidValidate(userId)) {
    console.error("❌ Invalid UUID for user_id:", userId);
    return { success: false, message: `Invalid UUID for user_id: ${userId}` };
  }

  try {
    // ✅ Step 1: Confirm user exists
    console.log(`🔍 Checking if user ${userId} exists in database...`);
    const userCheckResult = await pool.query('SELECT id FROM "users" WHERE id = $1', [userId]);

    if (userCheckResult.rowCount === 0) {
      console.warn(`⚠️ User with ID ${userId} does not exist in 'users' table.`);
      return { success: false, message: `User with ID ${userId} does not exist.` };
    }

    console.log(`✅ User ${userId} exists.`);

    // ✅ Step 2: Prepare resume content
    const resumeContent = extractedText || (process.env.NODE_ENV !== "production" ? "Placeholder resume content" : null);

    if (!resumeContent) {
      console.error("❌ Resume content is empty. Aborting save.");
      return { success: false, message: "Resume content is empty." };
    }

    const resumeId = uuidv4();
    const title = resumeData.name ?? "Untitled Resume";

    console.log(`🛠 Inserting resume with ID ${resumeId} for user ${userId}...`);

    // ✅ Step 3: Insert resume into DB
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
      console.error("❌ Failed to insert resume into database.");
      return { success: false, message: "Failed to insert resume into database." };
    }

    console.log(`✅ Resume successfully saved with ID: ${resumeId}`);
    return { success: true, message: "Resume saved successfully." };

  } catch (error) {
    console.error("❌ Database error in saveToPostgreSQL:", error);
    return { success: false, message: "An error occurred while saving the resume. Please try again." };
  }
};

export const getFromPostgreSQL = async (fileHash: string): Promise<string | null> => {
  const result = await pool.query('SELECT extracted_text FROM "Resumes" WHERE file_hash = $1', [fileHash]);
  return result.rows.length ? result.rows[0].extracted_text : null;
};
