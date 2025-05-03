import express from "express";
import {
  registerLibrarian,
  registerFaculty,
  getAllLibrarians,
  checkServerHealth,
  login,
  logout,
} from "../controllers/admin.controller.js";

import {getAllStudents,getAllBooks,getBookDetailsByBookId,getStudentFullDetails,
  getAllFaculty,
  getFacultyFullDetails,
  bookTraking,
} from "../controllers/librarian.controller.js";
import roleAuthMiddleware from "../middleware/roleAuth.middleware.js";
import adminAuthMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register-librarian",roleAuthMiddleware("admin"), registerLibrarian);
router.post('/register-Faculty',roleAuthMiddleware("admin"),registerFaculty);
router.get('/facultys',roleAuthMiddleware("admin"),getAllFaculty)
router.get("/librarians",roleAuthMiddleware("admin"), getAllLibrarians);
router.get("/books",roleAuthMiddleware("admin"), getAllBooks);
router.get("/health",roleAuthMiddleware("admin"), checkServerHealth);

router.get('/getAllStudents',getAllStudents);
router.get('/getAllBooks',getAllBooks);
router.get('/getBookById/:bookId',getBookDetailsByBookId)
router.get('/student-details/:studentId',getStudentFullDetails)
router.get('/faculty-details',getAllFaculty)
router.get('/faculty-details/:facultyId',getFacultyFullDetails);
router.get('/bookTraking/:bookId',bookTraking);

export default router;
