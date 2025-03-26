import { Router } from "express";
import { validateToken } from "../middleware/validateJWT.js";
import { promoteToAdmin } from "../controllers/devAdminController.js";

const router: Router = Router();

// 🛡️ Only works if you're logged in
router.post("/promote", validateToken, promoteToAdmin);

export default router;
