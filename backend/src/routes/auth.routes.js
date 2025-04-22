import express from "express";
import { forgotPassword, resetPassword ,login,logout} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/:userType/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
export default router;
