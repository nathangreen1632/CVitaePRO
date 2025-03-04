// ‼️Rerun Database Migration after updating this file‼️



import pkg from 'pg';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});



export const saveToPostgreSQL = async (fileHash: string, extractedText: string, userId: string) => {
  console.log("Debug: userId received in saveToPostgreSQL:", userId);  // ✅ Now userId is available within function scope

  if (!userId) {
    throw new Error("Invalid userId: Cannot save resume without a valid user ID.");
  }

  if (!userId || !uuidValidate(userId)) {
    throw new Error(`Invalid UUID for user_id: ${userId}`);
  }
  // ❌ remove this query during production
  const resumeContent = extractedText || (process.env.NODE_ENV !== "production" ? "Placeholder resume content" : null);

  // ‼️ Include this block in production only ‼️
  // if (!extractedText) {
  //   throw new Error("Resume content is missing"); // ✅ Ensure content is always provided
  // }


  await pool.query(
    'INSERT INTO "Resumes" (id, file_hash, extracted_text, user_id, content, updated_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [uuidv4(), fileHash, extractedText, userId, resumeContent]
  );

};

export const getFromPostgreSQL = async (fileHash: string): Promise<string | null> => {
  const result = await pool.query('SELECT extracted_text FROM "Resumes" WHERE file_hash = $1', [fileHash]);
  return result.rows.length ? result.rows[0].extracted_text : null;
};
