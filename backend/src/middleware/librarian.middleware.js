import jwt from "jsonwebtoken";
import Librarian from "../models/librarian.model.js";

const authMiddleware = async (req, res, next) => {
  try {
   
    // Get the token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the librarian exists
    const librarian = await Librarian.findById(decoded.id);
    if (!librarian) {
      return res.status(401).json({ success: false, message: "Invalid token or librarian does not exist." });
    }

    // Attach librarian details to the request object
    req.librarian = librarian;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
  }
};

export default authMiddleware;
