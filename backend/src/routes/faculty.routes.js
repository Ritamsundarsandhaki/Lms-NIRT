import express from "express";
import { 
  facultyLogin, 
  getFacultyProfile, 
  getIssuedBooks, 
  getFacultyHistory, 
  logout 
} from "../controllers/faculty.controller.js";
import facultyAuthMiddleware from "../middleware/faculty.middleware.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/logout", logout);
router.get("/profile", facultyAuthMiddleware, getFacultyProfile);
router.get("/issued-books", facultyAuthMiddleware, getIssuedBooks);
router.get("/history", facultyAuthMiddleware, getFacultyHistory);

export default router;
