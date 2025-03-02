import express, {Router} from "express";
import { generateCoverLetter } from "../controllers/coverLetterController.js";
import {rateLimiter} from "../middleware/rateLimiter.js";

const router: Router = express.Router();

router.post("/generate", rateLimiter("openai"), generateCoverLetter);

export default router;
