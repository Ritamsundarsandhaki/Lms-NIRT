import express from "express";
import { 
  registerStudent, 
  registerBook, 
  issueBook, 
  returnBook, 
  searchStudents, 
  searchBooks ,
  login,
  profile,
  dashboardData,
  logout,
  getAllStudents,
  getAllBooks,
  uploadBooks,
  uploadStudents
} from "../controllers/librarian.controller.js";
import authMiddleware from "../middleware/librarian.middleware.js";
import upload from "../middleware/upload.Middleware.js";

const router = express.Router();

router.post('/login',login)
router.post('/logout',logout);
router.post("/register-student",authMiddleware, registerStudent);
router.post("/register-book",authMiddleware, registerBook);
router.post("/upload-books", upload.single("file"), uploadBooks);
router.post("/upload-students", upload.single("file"), uploadStudents);
router.post("/issue-book",authMiddleware, issueBook);
router.post("/return-book",authMiddleware, returnBook);
router.get("/search-student",authMiddleware, searchStudents);
router.get("/search-book",authMiddleware, searchBooks);
router.get('/profile',authMiddleware, profile);
router.get('/dashboardData',authMiddleware,dashboardData)
router.get('/getAllStudents',authMiddleware,getAllStudents);
router.get('/getAllBooks',authMiddleware,getAllBooks)

export default router;
