import { Router } from "express";
import {  generateResume } from "../controllers/openAIController.js";
import { generateCoverLetter } from "../controllers/coverLetterController.js";

const router: Router = Router();

// Route to generate a cover letter
router.post("/generate-cover-letter", generateCoverLetter);

// Route to enhance a resume using OpenAI
router.post("/enhance-resume", generateResume);

export default router;