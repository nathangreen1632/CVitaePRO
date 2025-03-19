import {Router} from "express";
import {register, login, changePassword} from "../controllers/authController.js";
import {authenticateUser} from "../middleware/authMiddleware.js";


const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authenticateUser, changePassword);

export default router;
