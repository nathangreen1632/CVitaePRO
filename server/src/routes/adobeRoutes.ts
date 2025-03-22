import express, { Request, Response, NextFunction, Router } from "express";
import multer, { Multer } from "multer";
import dotenv from "dotenv";
import { processAdobePDF } from "../services/adobeService.js";
import { storeExtractedText, getExtractedText } from "../services/redisService.js";
import { saveToPostgreSQL, getFromPostgreSQL } from "../services/postgreSQLService.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { authenticateUser } from "../services/authService.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

dotenv.config();

const router: Router = express.Router();
const upload: Multer = multer({ dest: "/tmp/" });

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

router.post(
  "/upload",
  authenticateUser,
  rateLimiter("adobe_upload"),
  upload.single("pdf"),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export default router;
