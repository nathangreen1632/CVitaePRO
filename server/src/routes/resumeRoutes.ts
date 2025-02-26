import { Router } from "express";
import { uploadResume, processResume } from "../controllers/resumeController.js";
import { validateToken } from "../middleware/validateJWT.js";
import { generateResume } from "../controllers/openaiController.js";

const router: Router = Router();

// Routes for Resume Processing
router.post("/generate", validateToken, generateResume); // ✅ Explicit Path for Resume Generation
router.post("/upload", validateToken, uploadResume);
router.post("/process", validateToken, processResume);

export default router;
