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
  userId: string
): Promise<{ success: boolean; message: string }> => {
  console.log("🛠 Debug: Entering saveToPostgreSQL...");
  console.log("📌 Debug: userId received in saveToPostgreSQL:", userId);

  if (!userId || !uuidValidate(userId)) {
    console.error("❌ Invalid UUID for user_id:", userId);
    return { success: false, message: `Invalid UUID for user_id: ${userId}` };
  }

  try {
    // ✅ Step 1: Check if the user exists in `users` table
    console.log(`🔍 Checking if user ${userId} exists in database...`);
    const userCheckResult = await pool.query('SELECT id FROM "users" WHERE id = $1', [userId]);

    if (userCheckResult.rowCount === 0) {
      console.warn(`⚠️ User with ID ${userId} does not exist in 'users' table.`);
      return { success: false, message: `User with ID ${userId} does not exist.` };
    }
    console.log(`✅ User ${userId} exists.`);

    // ✅ Step 2: Ensure resume content is valid
    console.log("📌 Extracted resume text before saving:", extractedText);
    const resumeContent = extractedText || (process.env.NODE_ENV !== "production" ? "Placeholder resume content" : null);

    if (!resumeContent) {
      console.error("❌ Resume content is empty. Aborting save.");
      return { success: false, message: "Resume content is empty." };
    }

    console.log("📌 Final resume content before inserting:", resumeContent);

    // ✅ Step 3: Insert into `Resumes`
    const resumeId = uuidv4();
    console.log(`🛠 Inserting resume with ID ${resumeId} for user ${userId}...`);

    const insertQuery = `
      INSERT INTO "Resumes" (id, file_hash, extracted_text, user_id, content, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id;
    `;

    const insertResult = await pool.query(insertQuery, [
      resumeId,
      fileHash,
      extractedText,
      userId,
      resumeContent,
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
