import { Router } from 'express';
import { generateResumeHandler } from '../controllers/resumeController.js';
// import { authenticateUser } from '../middleware/authMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router: Router = Router();

router.post('/generate', rateLimiter, generateResumeHandler);

export default router;
