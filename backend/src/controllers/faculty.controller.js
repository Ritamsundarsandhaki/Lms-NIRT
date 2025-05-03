import Faculty from "../models/faculty.model.js";
import Book from "../models/book.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BookIssueLog from '../models/bookIssueLog.model.js'

/**
 * @desc Faculty Login
 * @route POST /faculty/login
 */

export const facultyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }
  
      // Find faculty by email
      const faculty = await Faculty.findOne({ email });
      if (!faculty) {
        return res.status(404).json({ success: false, message: "Faculty not found" });
      }
  
      // Check password (assuming password is hashed in DB)
      const isMatch = await bcrypt.compare(password, faculty.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: faculty._id, email: faculty.email, type: "faculty" }, process.env.JWT_SECRET, { expiresIn: "3d" });
  
      res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevent XSS attack
        sameSite: "strict", // Prevent CSRF attack
        secure: process.env.NODE_MODE !== "development",
      });
  
      res.status(200).json({ success: true, message: "Login successful", type: "faculty", token });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
/**
 * @desc Faculty Logout
 * @route POST /faculty/logout
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_MODE !== "development",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get Faculty Profile
 * @route GET /faculty/profile
 */
export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).select("-password"); // Exclude password

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Fetch issued books (not returned yet)
    const issuedBooks = await BookIssueLog.find({
      userId: req.user.id,
      userModel: "Faculty",
      returned: false,
    }).populate("bookCopy");

    res.status(200).json({
      success: true,
      faculty: {
        ...faculty._doc, // Spread faculty details
        issuedBooks,     // Add issuedBooks array
      },
    });
  } catch (error) {
    console.error("Error fetching faculty profile:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


/**
 * @desc Get Issued Books with Fine Calculation for Faculty
 * @route GET /faculty/issued-books
 */

export const getIssuedBooks = async (req, res) => {
  try {
    const today = new Date();
    const finePerDay = 2; // ₹2 per day
    const maxDaysAllowed = 14; // 2 weeks loan duration

    // Fetch unreturned books for current user (Faculty)
    const issueLogs = await BookIssueLog.find({
      userId: req.user.id,
      userModel: "Faculty",
      returned: false,
    }).populate("bookCopy");

    const issuedBooks = issueLogs.map((log) => {
      const issueDate = new Date(log.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + maxDaysAllowed);

      let fine = 0;
      if (today > dueDate) {
        const overdueDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        fine = overdueDays * finePerDay;
      }

      return {
        bookId: {
          bookId: log.bookCopy?.bookId,
          returned: log.returned,
          _id: log.bookCopy?._id,
          issueDate: log.issueDate,
        },
        fine,
      };
    });

    res.status(200).json({ success: true, issuedBooks });
  } catch (error) {
    console.error("Error in getIssuedBooks:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get Faculty History of Issued & Returned Books
 * @route GET /faculty/history
 */
export const getFacultyHistory = async (req, res) => {
  try {
    const issueLogs = await BookIssueLog.find({
      userId: req.user.id,
    }).populate({
      path: "bookCopy",
      populate: {
        path: "book", // NOT bookId directly, need book title
        model: "Book",
      },
    });

    const history = issueLogs.map((log) => ({
      title: log.bookCopy?.book?.title || "Unknown Title",
      bookId: log.bookCopy?.bookId || "N/A", // your custom bookId like BK001
      issueDate: log.issueDate,
      returnDate: log.returnDate || "Not Returned",
      status: log.returned ? "Returned" : "Issued",
    }));

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error in getFacultyHistory:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

