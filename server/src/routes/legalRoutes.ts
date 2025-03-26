import express, {Router} from "express";
import { saveAgreementConfirmation } from "../controllers/legalController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router: Router = express.Router();

router.post("/agree", authenticateUser, saveAgreementConfirmation);

export default router;
