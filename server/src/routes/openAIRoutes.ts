import { Router } from "express";
import { generateCoverLetter, enhanceResume } from "../controllers/openAIController.js";

const router: Router = Router();

// Route to generate a cover letter
router.post("/generate-cover-letter", generateCoverLetter);

// Route to enhance a resume using OpenAI
router.post("/enhance-resume", enhanceResume);

export default router;