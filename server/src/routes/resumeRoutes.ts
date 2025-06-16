import { Router, Request, Response, NextFunction } from "express";
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

const MAX_UPLOAD_SIZE_MB: number = Number(process.env.RESUME_MAX_UPLOAD_MB ?? "10");

const upload: Multer = multer({
  limits: {
    fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb): void => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Unsupported file type"));
    } else {
      cb(null, true);
    }
  },
});

const router: Router = Router();

router.post("/generate", authenticateUser, generateResume);
router.post("/upload", uploadResume); // controller handles raw/text uploads
router.post("/process", processResume);
router.post("/enhance", enhanceResume);
router.post("/download", authenticateUser, downloadEditorPdf);
router.post("/download-docx", authenticateUser, downloadEditorDocx);
router.post("/parse-pdf", upload.single("resume"), parsePdf);
router.get("/list", authenticateUser, listResumes);
router.get("/:id", getResumeById);
router.get("/:id/download", authenticateUser, downloadResume);
router.delete("/:resumeId", authenticateUser, deleteResume);

router.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res
        .status(413)
        .json({ error: `File exceeds ${MAX_UPLOAD_SIZE_MB} MB limit` });
    } else {
      res.status(400).json({ error: err.message });
    }
  } else if (err instanceof Error && err.message === "Unsupported file type") {
    res.status(415).json({ error: err.message });
  } else {
    next(err);
  }
});

export default router;
