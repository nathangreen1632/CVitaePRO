import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const OPENAI_URL: string = process.env.OPENAI_URL ?? "https://api.openai.com/v1/chat/completions";
export const OPENAI_KEY: string = process.env.OPENAI_KEY ?? "secret";

export const DB_NAME: string = process.env.DB_NAME ?? "your_database_name";
export const DB_USER: string = process.env.DB_USER ?? "your_database_user";
export const DB_PASS: string = process.env.DB_PASS ?? "secret";
export const DB_HOST: string = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
export const DB_URL: string = process.env.DB_URL ?? `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const JWT_SECRET: string = process.env.JWT_SECRET ?? "secret";
export const PORT: number = Number(process.env.PORT) || 3000;

export const REDIS_PORT: number = Number(process.env.REDIS_PORT) || 17172;
export const REDIS_HOST: string = process.env.REDIS_HOST ?? "secret";
export const REDIS_USERNAME: string = process.env.REDIS_USERNAME ?? "secret";
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD ?? "secret";
