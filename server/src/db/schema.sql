-- ✅ Drop and recreate the database for a fresh start
DROP DATABASE IF EXISTS cvitaepro_db;
CREATE DATABASE cvitaepro_db;

-- ✅ Connect to the new database
\c cvitaepro_db;

-- ✅ Drop existing tables if they exist (only for fresh start)
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cover_letters;

-- ✅ Create the users table with UUID as primary key
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username VARCHAR(255) UNIQUE NOT NULL,
                       passwordhash TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP DEFAULT NOW()
);

-- ✅ Create the resumes table linked to users.id
CREATE TABLE resumes (
                         file_hash TEXT PRIMARY KEY,
                         user_id UUID NOT NULL,
                         extracted_text TEXT NOT NULL,
                         updated_at TIMESTAMP DEFAULT NOW(),

                         CONSTRAINT fk_user FOREIGN KEY (user_id)
                             REFERENCES users(id)
                             ON DELETE CASCADE
);

-- ✅ Create the cover_letters table linked to users.id
CREATE TABLE cover_letters (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id UUID NOT NULL,
                               content TEXT NOT NULL,
                               created_at TIMESTAMP DEFAULT NOW(),
                               updated_at TIMESTAMP DEFAULT NOW(),

                               CONSTRAINT fk_cover_letters_user FOREIGN KEY (user_id)
                                   REFERENCES users(id)
                                   ON DELETE CASCADE
);

-- ✅ Create indexes for faster lookup
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);