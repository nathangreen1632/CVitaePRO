import {Router} from "express";
import authRoutes from "./authRoutes.js";
import atsRoutes from "./atsRoutes.js";
import openaiRoutes from "./openaiRoutes.js";
import adobeRoutes from "./adobeRoutes.js";
import coverLetterRoutes from "./coverLetterRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/ats", atsRoutes);
router.use("/openai", openaiRoutes);
router.use("/adobe", adobeRoutes);
router.use("/cover-letter", coverLetterRoutes);
router.use("/resume", resumeRoutes);
router.use("/admin", adminRoutes);

export default router;
