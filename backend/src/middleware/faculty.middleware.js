import jwt from "jsonwebtoken";
import Faculty from "../models/faculty.model.js";

const facultyAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is a faculty member
    const faculty = await Faculty.findById(decoded.id);
    if (!faculty) {
      return res.status(401).json({ success: false, message: "Invalid token or faculty does not exist." });
    }

    // Attach faculty details to request object
    req.user = faculty;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
  }
};

export default facultyAuthMiddleware;
