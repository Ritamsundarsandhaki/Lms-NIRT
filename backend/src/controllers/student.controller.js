import Student from "../models/student.models.js";
import Book from "../models/book.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BookIssueLog from '../models/bookIssueLog.model.js'
/**
 * @desc Student Login
 * @route POST /student/login
 */
export const studentLogin = async (req, res) => {
  try {
    const { fileNo, password } = req.body;

    // Validate input
    if (!fileNo || !password) {
      return res.status(400).json({ success: false, message: "File No and password are required" });
    }

    // Find student by fileNo
    const student = await Student.findOne({ fileNo });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Check password (assuming password is hashed in DB)
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: student._id, fileNo: student.fileNo,type:'student' }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("jwt", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS attack (Cross Site Scripting)
        sameSite: "strict", // CSRF attack Cross Site request Forgery attack
        secure: process.env.NODE_MODE !== "development",
      });
    res.status(200).json({ success: true, message: "Login successful",type:"student" ,token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear the jwt cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_MODE !== "development", // Set this to false if running in development mode
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
/**
 * @desc Get Student Profile
 * @route GET /student/profile
 */
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password"); // Exclude password

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get Issued Books with Fine Calculation
 * @route GET /student/issued-books
 */
/**
 * @desc Get Issued Books with Fine Calculation
 * @route GET /student/issued-books
 */

// export const getIssuedBooks = async (req, res) => {
//   try {
//     const student = await Student.findById(req.user.id).populate("issuedBooks.bookId");

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     // Filter books that are not returned
//     const issuedBooks = student.issuedBooks
//       .filter((book) => !book.returned) // Get only books that are not returned
//       .map((book) => {
//         let fine = 0;
//         return {
//           bookId: book,
//           fine
          
//         };
//       });

//     res.status(200).json({ success: true, issuedBooks });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

export const getIssuedBooks = async (req, res) => {
  try {
    const today = new Date();
    const finePerDay = 2; // ₹2 per day
    const maxDaysAllowed = 14; // 2 weeks loan duration

    // Fetch unreturned books for current user (Student or Faculty)
    const issueLogs = await BookIssueLog.find({
      userId: req.user.id,
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
 * @desc Get Student History of Issued & Returned Books
 * @route GET /student/history
 */
// export const getStudentHistory = async (req, res) => {
//   try {
//     const student = await Student.findById(req.user.id).populate("issuedBooks.bookId");

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     const history = student.issuedBooks.map((book) => ({
//       title: book.bookId,
//       issueDate: book.issueDate,
//       returnDate: book.returnDate || "Not Returned",
//       status: book.returned ? "Returned" : "Issued",
//     }));

//     res.status(200).json({ success: true, history });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

export const getStudentHistory = async (req, res) => {
  try {
    const issueLogs = await BookIssueLog.find({
      userId: req.user.id,
    }).populate({
      path: "bookCopy",
      populate: {
        path: "book", // NOT bookId
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
    console.error("Error in getStudentHistory:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
