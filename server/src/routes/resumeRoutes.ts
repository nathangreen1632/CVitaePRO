import { Router } from "express";
import multer from "multer";
import {uploadResume, processResume, enhanceResume, getResumeById, listResumes, deleteResume, downloadResume} from "../controllers/resumeController.js";
import { generateResume } from "../controllers/openaiController.js";
import {authenticateUser} from "../middleware/authMiddleware.js";
import { parsePdf } from "../controllers/parsePdfController.js";

const router: Router = Router();
const upload = multer();


// Routes for Resume Processing
router.post("/generate", authenticateUser, generateResume); // ✅ Explicit Path for Resume Generation
router.post("/upload",  uploadResume); // ✅ Explicit Path for Resume Upload
router.post("/process",  processResume); // ✅ Explicit Path for Resume Processing
router.post("/enhance", enhanceResume); // ✅ Explicit Path for Resume Enhancement
router.get("/list", authenticateUser, listResumes) // ✅ Explicit Path for Resume Listing
router.get("/:id",  getResumeById); // ✅ Explicit Path for Resume Retrieval
router.get("/:id/download", authenticateUser, downloadResume); // ✅ Explicit Path for Resume Download
router.delete("/:resumeId", authenticateUser, deleteResume); // ✅ Explicit Path for Resume Deletion
router.post("/parse-pdf", upload.single("resume"), parsePdf);



export default router;
