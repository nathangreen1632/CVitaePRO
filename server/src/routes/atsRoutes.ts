import { Router, Request, Response } from "express";
import { scoreResume } from "../controllers/atsController.js";

const router: Router = Router();

// Route to score a resume for ATS compliance
router.post("/score-resume", async (req: Request, res: Response) => {
  try {
    await scoreResume(req, res);
  } catch (error) {
    console.error("Error in /score-resume:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;