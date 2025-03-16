import express, {Router} from "express";
import { generateCoverLetter, downloadCoverLetter, downloadCoverLetterDocx } from "../controllers/coverLetterController.js";
import {rateLimiter} from "../middleware/rateLimiter.js";


const router: Router = express.Router();

router.post("/generate", rateLimiter("openai"), generateCoverLetter);
router.post("/download", downloadCoverLetter);
router.post("/download-docx", downloadCoverLetterDocx);

export default router;
