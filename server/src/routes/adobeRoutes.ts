import express, {Request, Response, NextFunction, Router} from 'express';
import multer, {Multer} from 'multer';
import dotenv from 'dotenv';
import { processAdobePDF } from '../services/adobeService.js';
import { storeExtractedText, getExtractedText } from '../services/redisService.js';
import { saveToPostgreSQL, getFromPostgreSQL } from '../services/postgreSQLService.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

dotenv.config();

const router: Router = express.Router();
const upload: Multer = multer({ dest: '/tmp/' }); // Temporary storage for large files

// ✅ Define a properly typed request interface
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// ✅ **Upload & Process PDF**
router.post('/upload', authenticateUser, rateLimiter('adobe_upload'), upload.single('pdf'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  (async () => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized - No user ID found' });
        return;
      }

      const fileHash = uuidv4();
      const filePath = req.file.path;

      // ✅ **Process file with Adobe API**
      const extractedText = await processAdobePDF(filePath);

      // ✅ **Store extracted text in Redis (30 min)**
      await storeExtractedText(userId, fileHash, extractedText, 1800);

      // ✅ **Store permanently in PostgreSQL**
      await saveToPostgreSQL(fileHash, extractedText, userId);

      // ✅ **Cleanup temp file after processing**
      fs.unlinkSync(filePath);

      res.json({ message: 'File processed successfully', fileHash });
    } catch (error) {
      console.error('❌ Error processing file:', error);
      next(error);
    }
  })();
});

// ✅ **Fetch Processed Resume**
router.get('/resume/:fileHash', authenticateUser, rateLimiter('adobe_fetch'), (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { fileHash } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized - No user ID found' });
        return;
      }

      // ✅ **Check Redis Cache First**
      let extractedText = await getExtractedText(userId, fileHash);
      if (!extractedText) {
        // ✅ **Fallback to PostgreSQL**
        extractedText = await getFromPostgreSQL(fileHash);
        if (!extractedText) {
          res.status(404).json({ error: 'Resume data not found' });
          return;
        }
      }

      res.json({ extractedText });
    } catch (error) {
      console.error('❌ Error retrieving resume:', error);
      next(error);
    }
  })();
});

export default router;
