import express, { Request, Response, NextFunction, Router } from "express";
import multer, { Multer } from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import os from "os";
import path from "path";

import { processAdobePDF } from "../services/adobeService.js";
import { storeExtractedText, getExtractedText } from "../services/redisService.js";
import { saveToPostgreSQL, getFromPostgreSQL } from "../services/postgreSQLService.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { authenticateUser } from "../services/authService.js";

dotenv.config();

const TMP_UPLOAD_DIR: string = fs.mkdtempSync(path.join(os.tmpdir(), "adobe-"));
fs.chmodSync(TMP_UPLOAD_DIR, 0o700);

const MAX_UPLOAD_SIZE_MB: number = Number(process.env.ADOBE_PDF_MAX_UPLOAD_MB ?? "10");

const upload: Multer = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, TMP_UPLOAD_DIR),
    filename: (_req, _file, cb) => cb(null, `${Date.now()}-${uuidv4()}.pdf`),
  }),
  limits: {
    fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb): void => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
    } else {
      cb(null, true);
    }
  },
});

const router: Router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

router.post(
  "/upload",
  authenticateUser,
  rateLimiter("adobe_upload"),
  upload.single("pdf"),
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    (async () => {
      try {
        if (!req.file) {
          res.status(400).json({ error: "No file uploaded" });
          return;
        }

        const userId = req.user?.id;
        if (!userId) {
          res.status(401).json({ error: "Unauthorized - No user ID found" });
          return;
        }

        const fileHash = uuidv4();
        const filePath = req.file.path;

        const extractedText = await processAdobePDF(filePath);

        await storeExtractedText(userId, fileHash, extractedText, 1800);

        const parsedResume = JSON.parse(extractedText);
        await saveToPostgreSQL(fileHash, extractedText, userId, parsedResume);

        fs.unlinkSync(filePath);

        res.json({ message: "File processed successfully", fileHash });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.get(
  "/resume/:fileHash",
  authenticateUser,
  rateLimiter("adobe_fetch"),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    (async () => {
      try {
        const { fileHash } = req.params;
        const userId = req.user?.id;

        if (!userId) {
          res.status(401).json({ error: "Unauthorized - No user ID found" });
          return;
        }

        let extractedText = await getExtractedText(userId, fileHash);
        if (!extractedText) {
          extractedText = await getFromPostgreSQL(fileHash);
          if (!extractedText) {
            res.status(404).json({ error: "Resume data not found" });
            return;
          }
        }

        res.json({ extractedText });
      } catch (error) {
        next(error);
      }
    })();
  }
);

router.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res
        .status(413)
        .json({ error: `PDF exceeds ${MAX_UPLOAD_SIZE_MB} MB limit` });
    } else {
      res.status(400).json({ error: err.message });
    }
  } else if (err instanceof Error && err.message === "Only PDF files are allowed") {
    res.status(415).json({ error: err.message });
  } else {
    next(err);
  }
});

export default router;
