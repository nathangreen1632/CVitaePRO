DROP DATABASE IF EXISTS cvitaepro_db;
CREATE DATABASE cvitaepro_db;


\c cvitaepro_db;

DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cover_letters;

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username VARCHAR(255) UNIQUE NOT NULL,
                       passwordhash TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Resumes (
                         file_hash TEXT PRIMARY KEY,
                         user_id UUID NOT NULL,
                         extracted_text TEXT NOT NULL,
                         updated_at TIMESTAMP DEFAULT NOW(),

                         CONSTRAINT fk_user FOREIGN KEY (user_id)
                             REFERENCES users(id)
                             ON DELETE CASCADE
);

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

CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);