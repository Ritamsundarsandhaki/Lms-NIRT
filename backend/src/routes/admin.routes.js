import express from "express";
import {
  registerLibrarian,
  registerFaculty,
  getAllLibrarians,
  getAllStudents,
  getAllBooks,
  checkServerHealth,
  login,
  logout,
  getAllFaculty
} from "../controllers/admin.controller.js";
import adminAuthMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post('/login',login);
router.post('/logout',logout)
router.post("/register-librarian", adminAuthMiddleware, registerLibrarian);
router.post('/register-Faculty',adminAuthMiddleware,registerFaculty);
router.get('/facultys',adminAuthMiddleware,getAllFaculty)
router.get("/librarians", adminAuthMiddleware, getAllLibrarians);
router.get("/students", adminAuthMiddleware, getAllStudents);
router.get("/books", adminAuthMiddleware, getAllBooks);
router.get("/health",adminAuthMiddleware, checkServerHealth);

export default router;
