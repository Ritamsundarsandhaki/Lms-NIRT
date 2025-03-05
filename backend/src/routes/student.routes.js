import express from "express";
import { studentLogin, getStudentProfile, getIssuedBooks, getStudentHistory ,logout} from "../controllers/student.controller.js";
import studentAuthMiddleware from "../middleware/student.middleware.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post('/logout',logout)
router.get("/profile", studentAuthMiddleware, getStudentProfile);
router.get("/issued-books", studentAuthMiddleware, getIssuedBooks);
router.get("/history", studentAuthMiddleware, getStudentHistory);

export default router;
