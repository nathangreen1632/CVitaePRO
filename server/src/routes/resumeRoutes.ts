import { Router } from "express";
import {uploadResume, processResume, enhanceResume, getResumeById} from "../controllers/resumeController.js";
// import { validateToken } from "../middleware/validateJWT.js";
import { generateResume } from "../controllers/openaiController.js";
// import {authenticateUser} from "../middleware/authMiddleware.js";

const router: Router = Router();

// Routes for Resume Processing
router.post("/generate",  generateResume); // ✅ Explicit Path for Resume Generation
router.post("/upload",  uploadResume); // ✅ Explicit Path for Resume Upload
router.post("/process",  processResume); // ✅ Explicit Path for Resume Processing
router.post("/enhance", enhanceResume); // ✅ Explicit Path for Resume Enhancement
router.get("/:id",  getResumeById); // ✅ Explicit Path for Resume Retrieval

export default router;
