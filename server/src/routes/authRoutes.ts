import {Router} from "express";
import { register, login } from "../controllers/authController.js";

const router: Router = Router();

// ✅ Public routes (No authentication required)
router.post("/register", register);
router.post("/login", login);

export default router;
