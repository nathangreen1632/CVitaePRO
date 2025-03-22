import { Router } from "express";
import multer, { Multer } from "multer";
import {
  uploadResume,
  processResume,
  enhanceResume,
  getResumeById,
  listResumes,
  deleteResume,
  downloadResume,
  downloadEditorDocx,
  downloadEditorPdf,
} from "../controllers/resumeController.js";
import { generateResume } from "../controllers/openaiController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { parsePdf } from "../controllers/parsePdfController.js";

const router: Router = Router();
const upload: Multer = multer();

router.post("/generate", authenticateUser, generateResume);
router.post("/upload", uploadResume);
router.post("/process", processResume);
router.post("/enhance", enhanceResume);
router.post("/download", authenticateUser, downloadEditorPdf);
router.post("/download-docx", authenticateUser, downloadEditorDocx);
router.post("/parse-pdf", upload.single("resume"), parsePdf);
router.get("/list", authenticateUser, listResumes);
router.get("/:id", getResumeById);
router.get("/:id/download", authenticateUser, downloadResume);
router.delete("/:resumeId", authenticateUser, deleteResume);

export default router;
