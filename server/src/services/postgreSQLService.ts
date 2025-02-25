import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const saveToPostgreSQL = async (fileHash: string, extractedText: string, userId: string) => {
  await pool.query(
    'INSERT INTO resumes (file_hash, extracted_text, user_id) VALUES ($1, $2, $3) ON CONFLICT (file_hash) DO UPDATE SET extracted_text = $2',
    [fileHash, extractedText, userId]
  );
};

export const getFromPostgreSQL = async (fileHash: string): Promise<string | null> => {
  const result = await pool.query('SELECT extracted_text FROM resumes WHERE file_hash = $1', [fileHash]);
  return result.rows.length ? result.rows[0].extracted_text : null;
};
