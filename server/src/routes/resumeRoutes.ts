import { Router } from "express";
import {uploadResume, processResume, enhanceResume} from "../controllers/resumeController.js";
import { validateToken } from "../middleware/validateJWT.js";
import { generateResume } from "../controllers/openaiController.js";

const router: Router = Router();

// Routes for Resume Processing
router.post("/generate", validateToken, generateResume); // ✅ Explicit Path for Resume Generation
router.post("/upload", validateToken, uploadResume); // ✅ Explicit Path for Resume Upload
router.post("/process", validateToken, processResume); // ✅ Explicit Path for Resume Processing
router.post("/enhance", validateToken, enhanceResume); // ✅ Explicit Path for Resume Enhancement

export default router;
