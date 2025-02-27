import express, {Router} from "express";
import { generateCoverLetter, generateResume } from "../controllers/openaiController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router: Router = express.Router();

router.post("/enhance-resume", rateLimiter("openai"), generateResume);
router.post("/generate-cover-letter", rateLimiter("openai"), generateCoverLetter);


export default router;
