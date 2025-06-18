import multer, { FileFilterCallback, Multer } from "multer";
import fs from "fs";
import os from "os";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function createTempUploadDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  fs.chmodSync(dir, 0o700);
  return dir;
}

export function createMulterUpload(config: {
  maxSizeMB: number;
  fileFilter: (mimetype: string) => boolean;
  storagePath?: string;
}): Multer {
  const { maxSizeMB, fileFilter, storagePath } = config;

  return multer({
    storage: storagePath
      ? multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, storagePath),
        filename: (_req, _file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}.pdf`),
      })
      : undefined,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
    fileFilter: (_req, file, cb: FileFilterCallback) => {
      if (!fileFilter(file.mimetype)) {
        cb(new Error("Unsupported file type"));
      } else {
        cb(null, true);
      }
    },
  });
}

export function handleMulterErrors(
  customLimitMessage: string,
  acceptedMessage = "Unsupported file type"
) {
  return (err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: customLimitMessage });
      } else {
        res.status(400).json({ error: err.message });
      }
    } else if (err instanceof Error && err.message === acceptedMessage) {
      res.status(415).json({ error: err.message });
    } else {
      next(err);
    }
  };
}
