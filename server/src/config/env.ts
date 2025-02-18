import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
  PORT: process.env.PORT ?? "3000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  CVITAEPRO_API_KEY: process.env.CVITAEPRO_API_KEY ?? "",
  REDIS_URL: process.env.REDIS_URL ?? "",
};

if (!ENV.DATABASE_URL || !ENV.JWT_SECRET || !ENV.CVITAEPRO_API_KEY) {
  console.error("⚠️ Missing required environment variables! Please check your .env file.");
  process.exit(1);
}
