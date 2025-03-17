import express, {Router} from "express";
import {expandResumeEditorContent, generateResume} from "../controllers/openaiController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { authenticateUser } from "../services/authService.js";

const router: Router = express.Router();

router.post("/enhance-resume", authenticateUser, rateLimiter("openai"), generateResume);
router.post("/expand-editor", authenticateUser, expandResumeEditorContent); // 🧠 new route for editor expansion

export default router;
