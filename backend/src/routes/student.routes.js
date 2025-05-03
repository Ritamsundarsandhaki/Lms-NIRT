import express from "express";
import { studentLogin, getStudentProfile, getIssuedBooks, getStudentHistory ,logout,changeStudentPassword} from "../controllers/student.controller.js";
import studentAuthMiddleware from "../middleware/student.middleware.js";
import roleAuthMiddleware from "../middleware/roleAuth.middleware.js";
const router = express.Router();


router.get("/profile", roleAuthMiddleware("student"), getStudentProfile);
router.get("/issued-books",roleAuthMiddleware("student"), getIssuedBooks);
router.get("/history", roleAuthMiddleware("student"), getStudentHistory);
router.put("/changePassword", roleAuthMiddleware("student"), changeStudentPassword);

export default router;
