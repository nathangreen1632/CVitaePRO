import express, {Router} from "express";
import { validateToken, requireAdmin } from "../middleware/validateJWT.js";
import { register, login } from "../controllers/authController.js";
import { getAdminDashboard } from "../controllers/adminController.js"; // ✅ Import new admin controller

const router: Router = express.Router();

// ✅ Public routes (No authentication required)
router.post("/register", register);
router.post("/login", login);

// ✅ Admin-protected route (only admins can access)
router.get("/admin-dashboard", validateToken, requireAdmin, getAdminDashboard);

export default router;
