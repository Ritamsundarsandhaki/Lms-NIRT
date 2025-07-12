import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Librarian from "../models/librarian.model.js";
import Student from "../models/student.models.js";
import Faculty from "../models/faculty.model.js";

// Role to Model map
const modelMap = {
  admin: Admin,
  librarian: Librarian,
  student: Student,
  faculty: Faculty,
};

// Unified auth middleware
const roleAuthMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided in header.",
        });
      }

      const token = authHeader.split(" ")[1];

      // Decode JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get appropriate model
      const Model = modelMap[role];
      if (!Model) {
        return res.status(500).json({
          success: false,
          message: "Invalid role specified in middleware.",
        });
      }

      // Find user by ID
      const user = await Model.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `Invalid token or ${role} not found.`,
        });
      }

      // Attach user and role to request
      req.user = user;
      req.role = role;
      req.userId = decoded.id;
      next();
    } catch (error) {
      const isExpired = error.name === "TokenExpiredError";
      return res.status(401).json({
        success: false,
        message: isExpired
          ? "Session expired. Please log in again."
          : "Unauthorized: Invalid or expired token.",
      });
    }
  };
};

export default roleAuthMiddleware;
