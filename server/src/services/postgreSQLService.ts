// ‼️Rerun Database Migration after updating this file‼️



import pkg from 'pg';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});



export const saveToPostgreSQL = async (fileHash: string, extractedText: string, userId: string): Promise<{ success: boolean; message: string }> => {
  console.log("Debug: userId received in saveToPostgreSQL:", userId);

  if (!userId || !uuidValidate(userId)) {
    return { success: false, message: `Invalid UUID for user_id: ${userId}` };
  }

  try {
    // ✅ Step 1: Check if user exists in `users` table
    const userCheckResult = await pool.query('SELECT id FROM "users" WHERE id = $1', [userId]);
    if (userCheckResult.rowCount === 0) {
      return { success: false, message: `User with ID ${userId} does not exist in 'users' table.` };
    }

    // ✅ Step 2: Ensure resume content is valid
    const resumeContent = extractedText || (process.env.NODE_ENV !== "production" ? "Placeholder resume content" : null);

    // ✅ Step 3: Insert into `Resumes`
    await pool.query(
      'INSERT INTO "Resumes" (id, file_hash, extracted_text, user_id, content, updated_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [uuidv4(), fileHash, extractedText, userId, resumeContent]
    );

    console.log("✅ Resume saved successfully in Resumes table.");
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
