import { Router, Request, Response, NextFunction } from "express";
import { uploadPdfToAdobe, createAdobeJob } from "../controllers/resumeController.js";

const router: Router = Router();

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { filePath, accessToken } = req.body;

      if (!filePath || !accessToken) {
        res.status(400).json({ error: "filePath and accessToken are required" });
        return;
      }

      const assetID = await uploadPdfToAdobe(filePath, accessToken);
      res.json({ assetID });
    } catch (error) {
      next(error);
    }
  })();
});

router.post("/extract", (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { assetID, accessToken } = req.body;

      if (!assetID || !accessToken) {
        res.status(400).json({ error: "assetID and accessToken are required" });
        return;
      }

      const jobID = await createAdobeJob(assetID, accessToken);
      res.json({ jobID });
    } catch (error) {
      next(error);
    }
  })();
});

export default router;
