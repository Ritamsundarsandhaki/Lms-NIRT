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
  uploadStudents,
  updateStudentProfile,
  updateBook,
  getBookDetailsByBookId,
  getStudentFullDetails,
  getAllFaculty,
  getFacultyFullDetails,
  changePassword,
  bookTraking
} from "../controllers/librarian.controller.js";
import authMiddleware from "../middleware/librarian.middleware.js";
import roleAuthMiddleware from "../middleware/roleAuth.middleware.js";
import upload from "../middleware/upload.Middleware.js";

const router = express.Router();


router.post("/register-student",roleAuthMiddleware("librarian"), registerStudent);
router.post("/register-book",roleAuthMiddleware("librarian"), registerBook);
router.put("/update-book/:copyId",roleAuthMiddleware("librarian"), updateBook);
router.put('/update-student',roleAuthMiddleware("librarian"),updateStudentProfile)
router.post("/upload-books",roleAuthMiddleware("librarian"), upload.single("file"), uploadBooks);
router.post("/upload-students",roleAuthMiddleware("librarian"), upload.single("file"), uploadStudents);
router.post("/issue-book",roleAuthMiddleware("librarian"), issueBook);
router.post("/return-book",roleAuthMiddleware("librarian"), returnBook);
router.put("/changePassword",roleAuthMiddleware("librarian"), changePassword)


router.get("/search-student",roleAuthMiddleware("librarian"), searchStudents);
router.get("/search-book",roleAuthMiddleware("librarian"), searchBooks);
router.get('/profile',roleAuthMiddleware("librarian"), profile);
router.get('/dashboardData',roleAuthMiddleware("librarian"),dashboardData)
router.get('/getAllStudents',roleAuthMiddleware("librarian"),getAllStudents);
router.get('/getAllBooks',roleAuthMiddleware("librarian"),getAllBooks);
router.get('/getBookById/:bookId',roleAuthMiddleware("librarian"),getBookDetailsByBookId)
router.get('/student-details/:studentId',roleAuthMiddleware("librarian"),getStudentFullDetails)
router.get('/faculty-details',roleAuthMiddleware("librarian"),getAllFaculty)
router.get('/faculty-details/:facultyId',roleAuthMiddleware("librarian"),getFacultyFullDetails);
router.get('/bookTraking/:bookId',roleAuthMiddleware("librarian"),bookTraking);


export default router;
