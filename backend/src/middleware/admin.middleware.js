import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid token or admin does not exist." });
    }

    req.admin = admin; // Attach admin to request
    next(); // Proceed to next middleware
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
  }
};

export default adminAuthMiddleware;
