import {Router} from "express";
import {requireAdmin, validateToken} from "../middleware/validateJWT.js";
import {authenticateUser} from "../services/authService.js";
import {getAdminDashboard, getLegalAgreementLogs } from "../controllers/adminController.js";

const router: Router = Router();

router.get("/admin-dashboard", validateToken, requireAdmin, authenticateUser, getAdminDashboard);
router.get("/legal-logs", validateToken, requireAdmin, authenticateUser, getLegalAgreementLogs);


export default router;