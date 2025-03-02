import express, {Router} from "express";
import { generateResume } from "../controllers/openaiController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router: Router = express.Router();

router.post("/enhance-resume", rateLimiter("openai"), generateResume);


export default router;
