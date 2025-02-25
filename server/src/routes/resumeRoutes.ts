import { Router } from "express";
import { uploadResume, processResume } from "../controllers/resumeController.js";
import { validateToken } from "../middleware/validateJWT.js"; // ✅ Ensure correct import

const router: Router = Router();

router.post("/upload", validateToken, uploadResume); // ✅ Should now work
router.post("/process", validateToken, processResume); // ✅ Should now work

export default router;
