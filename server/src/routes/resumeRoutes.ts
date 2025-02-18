import {RequestHandler, Router} from "express";
import { parsePdf, generateResumeHandler } from "../controllers/resumeController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router: Router = Router();

// Route to handle PDF parsing
router.post("/parse-pdf", parsePdf as RequestHandler);

// Route to handle resume generation
router.post("/generate", rateLimiter, generateResumeHandler);

export default router;
