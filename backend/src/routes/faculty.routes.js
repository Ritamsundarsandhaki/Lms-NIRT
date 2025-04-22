import express from "express";
import { 
  facultyLogin, 
  getFacultyProfile, 
  getIssuedBooks, 
  getFacultyHistory, 
  logout 
} from "../controllers/faculty.controller.js";
import facultyAuthMiddleware from "../middleware/faculty.middleware.js";
import roleAuthMiddleware from "../middleware/roleAuth.middleware.js";

const router = express.Router();

router.get("/profile",roleAuthMiddleware("faculty"), getFacultyProfile);
router.get("/issued-books",roleAuthMiddleware("faculty"), getIssuedBooks);
router.get("/history", roleAuthMiddleware("faculty"), getFacultyHistory);

export default router;
