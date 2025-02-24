import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const OPENAI_URL = process.env.OPENAI_URL ?? "https://api.openai.com/v1/chat/completions";
export const OPENAI_KEY = process.env.OPENAI_KEY ?? "secret";

export const DB_NAME = process.env.DB_NAME ?? "your_database_name";
export const DB_USER = process.env.DB_USER ?? "your_database_user";
export const DB_PASS = process.env.DB_PASS ?? "secret";
export const DB_HOST = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_URL = process.env.DB_URL ?? `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
export const PORT = Number(process.env.PORT) || 3000;

export const REDIS_PORT = Number(process.env.REDIS_PORT) || 17172;
export const REDIS_HOST = process.env.REDIS_HOST ?? "secret";
export const REDIS_USERNAME = process.env.REDIS_USERNAME ?? "secret";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? "secret";
