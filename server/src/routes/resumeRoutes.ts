import { Router } from "express";
import { Multer } from "multer";

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
import { createMulterUpload, handleMulterErrors } from "../utils/uploadUtils.js";

const MAX_UPLOAD_SIZE_MB: number = Number(process.env.RESUME_MAX_UPLOAD_MB ?? "10");

const upload: Multer = createMulterUpload({
  maxSizeMB: MAX_UPLOAD_SIZE_MB,
  fileFilter: (type) =>
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(type),
});

const router: Router = Router();

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

// 🧼 Centralized multer error handling
router.use(
  handleMulterErrors(
    `File exceeds ${MAX_UPLOAD_SIZE_MB} MB limit`,
    "Unsupported file type"
  )
);

export default router;
