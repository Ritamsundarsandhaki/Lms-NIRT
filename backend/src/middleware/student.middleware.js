import jwt from "jsonwebtoken";
import Student from "../models/student.models.js";

const studentAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is a student
    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(401).json({ success: false, message: "Invalid token or student does not exist." });
    }

    // Attach student details to request object
    req.user = student;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
  }
};

export default studentAuthMiddleware;
