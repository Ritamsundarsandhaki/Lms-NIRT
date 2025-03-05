import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is an admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid token or admin does not exist." });
    }

    // Attach admin details to request object
    req.admin = admin;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
  }
};

export default adminAuthMiddleware;
