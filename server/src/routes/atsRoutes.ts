import { Router } from "express";
import { scoreResume } from "../controllers/atsController.js";

const router: Router = Router();

// Route to score a resume for ATS compliance
router.post("/score-resume", scoreResume);


export default router;