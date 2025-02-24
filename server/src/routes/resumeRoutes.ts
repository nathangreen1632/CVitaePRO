import { Router } from "express";
import { uploadResume, processResume } from "../controllers/resumeController.js";
import { validateToken } from "../middleware/validateJWT.js"; // ✅ Ensure correct import

const router: Router = Router();

/**
 * @route   POST /api/resume/upload
 * @desc    Uploads a resume file
 * @access  Private (Requires JWT Authentication)
 */
router.post("/upload", validateToken, uploadResume); // ✅ Should now work

/**
 * @route   POST /api/resume/process
 * @desc    Processes an uploaded resume and structures the data
 * @access  Private (Requires JWT Authentication)
 */
router.post("/process", validateToken, processResume); // ✅ Should now work

export default router;
