import { Router } from "express";
import { register, login } from "../controllers/authController.js"; // ✅ Ensure correct import

const router: Router = Router();

router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
