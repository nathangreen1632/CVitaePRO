import { Router } from "express";
import authRoutes from "./authRoutes.js";
import openAIRoutes from "./openAIRoutes.js"; // Assuming OpenAI service
import atsRoutes from "./atsRoutes.js"; // Assuming ATS scoring service

const router: Router = Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/openai", openAIRoutes);
router.use("/ats", atsRoutes);

export default router;
