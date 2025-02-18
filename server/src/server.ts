import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import Logger from './register/logger.js';
import routes from './routes/index.js';
import { applyMiddleware } from './middleware/index.js';

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Apply all middleware (helmet, JSON, rate limiter)
applyMiddleware(app);
app.use(express.json());

// Connect Database
connectDatabase()
  .then(() => Logger.info('✅ Database connected successfully.'))
  .catch((err) => Logger.error('❌ Database connection failed:', err));

// API Routes
app.use('/api', routes);

// Default Route
app.get('/', (_req: Request, res: Response) => {
  res.json({message: 'CVitaePRO API is running 🚀'});
});

// Start Server
app.listen(PORT, () => Logger.info(`✅ Server is running on port ${PORT}`));

export default app;