import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME: string = process.env.DB_NAME ?? 'cvitaepro_db';
const DB_USER: string = process.env.DB_USER ?? 'postgres';
const DB_PASS: string = process.env.DB_PASS ?? 'root';
const DB_PORT: string = process.env.DB_PORT ?? '5432';
const DB_HOST: string = process.env.DB_HOST ?? '127.0.0.1';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
});

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // ‼️ Set to false for production ‼️
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Connect to the database first, then sync the tables
await connectDatabase();
await syncDatabase();
