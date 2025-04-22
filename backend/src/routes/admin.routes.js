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
import roleAuthMiddleware from "../middleware/roleAuth.middleware.js";
import adminAuthMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register-librarian",roleAuthMiddleware("admin"), registerLibrarian);
router.post('/register-Faculty',roleAuthMiddleware("admin"),registerFaculty);
router.get('/facultys',roleAuthMiddleware("admin"),getAllFaculty)
router.get("/librarians",roleAuthMiddleware("admin"), getAllLibrarians);
router.get("/students",roleAuthMiddleware("admin"), getAllStudents);
router.get("/books",roleAuthMiddleware("admin"), getAllBooks);
router.get("/health",roleAuthMiddleware("admin"), checkServerHealth);

export default router;
