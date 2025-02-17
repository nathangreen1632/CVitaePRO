import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import logger  from './register/logger.js';
import authRoutes from './routes/authRoutes.js';
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json());
app.use(helmet()); // Security headers

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 minute
  limit: 2, // Limit each IP to 2 requests per window
  message: '❌ Too many requests, please try again later.',
});

app.use(limiter);

// Connect Database
connectDatabase().then(() => {
  logger.info('Database connected successfully.');
}).catch((err) => {
  logger.error('Database connection failed:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', rateLimiter);

// Default route
app.get('/', (_req, res) => {
  res.json({ message: 'CVitaePRO API is running 🚀' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`✅ Server is running on port ${PORT}`);
});
