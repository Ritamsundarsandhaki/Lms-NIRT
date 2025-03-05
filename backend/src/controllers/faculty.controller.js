import Faculty from "../models/faculty.model.js";
import Book from "../models/book.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get Issued Books with Fine Calculation for Faculty
 * @route GET /faculty/issued-books
 */
export const getIssuedBooks = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate("issuedBooks.bookId");

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Filter books that are not returned
    const issuedBooks = faculty.issuedBooks
      .filter((book) => !book.returned)
      .map((book) => {
        let fine = 0;
        const dueDate = new Date(book.issueDate);
        dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days for faculty

        const today = new Date();
        if (today > dueDate) {
          const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
          fine = overdueDays * 5; // Rs. 5 per day fine
        }

        return {
          bookId: book,
          fine,
        };
      });

    res.status(200).json({ success: true, issuedBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get Faculty History of Issued & Returned Books
 * @route GET /faculty/history
 */
export const getFacultyHistory = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate("issuedBooks.bookId");

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    const history = faculty.issuedBooks.map((book) => ({
      title: book.bookId,
      issueDate: book.issueDate,
      returnDate: book.returnDate || "Not Returned",
      status: book.returned ? "Returned" : "Issued",
    }));

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
