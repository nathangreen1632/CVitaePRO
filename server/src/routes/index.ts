import { Router } from "express";
import authRoutes from "./authRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import openAIRoutes from "./openAIRoutes.js";
import atsRoutes from "./atsRoutes.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/openai", openAIRoutes);
router.use("/ats", atsRoutes);

export default router;
