import { Router } from "express";
import { getATSScore } from "../controllers/atsController.js";

const router: Router = Router();

router.post("/score-resume", getATSScore);

export default router;