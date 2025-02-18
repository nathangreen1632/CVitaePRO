import { Router } from 'express';
import authRoutes from './authRoutes.js';
import resumeRoutes from './resumeRoutes.js';
// import { authenticateUser } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router: Router = Router();

// Apply rate limiting to all API routes
router.use(rateLimiter);

// Authentication middleware (only applied where needed)
router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);

export default router;
