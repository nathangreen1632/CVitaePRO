import { Router } from "express";
import { getATSScore } from "../controllers/atsController.js";

const router: Router = Router();

// Route to score a resume for ATS compliance
router.post("/score-resume", getATSScore);


export default router;