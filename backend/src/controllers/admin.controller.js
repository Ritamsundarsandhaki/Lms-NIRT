import Admin from "../models/admin.model.js";
import Librarian from "../models/librarian.model.js";
import Student from "../models/student.models.js";
import Faculty from "../models/faculty.model.js";
import validator from "validator";
import Book from "../models/book.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Register a new librarian
 * @route POST /admin/register-librarian
 */

export const login = async (req,res) => {
    try {
        const {email ,password } = req.body;
        if(!email||!password)
        {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
         // Find student by fileNo
            const admin = await Admin.findOne({ email });
            if (!admin) {
              return res.status(404).json({ success: false, message: "Invailed username or password" });
            }
            console.log(admin);
            // Check password (assuming password is hashed in DB)
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log(isMatch)
            if (!isMatch) {
              return res.status(400).json({ success: false, message: "Invailed username or password" });
            }
        
            // Generate JWT token
            const token =  await jwt.sign({ id: admin._id, type: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("jwt", token, {
                maxAge: 3 * 24 * 60 * 60 * 1000,
                httpOnly: true, //prevent XSS attack (Cross Site Scripting)
                sameSite: "strict", // CSRF attack Cross Site request Forgery attack
                secure: process.env.NODE_MODE !== "development",
              });
        
            res.status(200).json({ success: true, message: "Login successful" ,type:"admin",token});
    } catch (error) {
        
    }
    
}

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


  // npm install validator

export const registerLibrarian = async (req, res) => {
  try {
    const { name, email, password, mobile, libraryName } = req.body;

    // Validate input fields
    if (!name || !email || !password || !mobile || !libraryName) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password (at least 8 characters, at least 1 number, 1 uppercase, 1 special character)
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ success: false, message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character" });
    }

    // Validate mobile number (for example: Indian mobile number)
    if (!validator.isMobilePhone(mobile, 'en-IN')) {
      return res.status(400).json({ success: false, message: "Invalid mobile number format" });
    }

    // Check if librarian already exists
    const existingLibrarian = await Librarian.findOne({ email });
    if (existingLibrarian) {
      return res.status(400).json({ success: false, message: "Librarian with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create librarian
    const librarian = new Librarian({ name, email, password: hashedPassword, mobile, libraryName, isApproved: true });
    await librarian.save();

    res.status(201).json({ success: true, message: "Librarian registered successfully", librarian });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all librarians
 * @route GET /admin/librarians
 */
export const getAllLibrarians = async (req, res) => {
  try {
    const librarians = await Librarian.find().select("-password"); // Exclude password

    res.status(200).json({ success: true, librarians });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all students
 * @route GET /admin/students
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password"); // Exclude password

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all books
 * @route GET /admin/books
 */

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




export const registerFaculty = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, mobile } = req.body;

    // Validate input fields
    if (!name || !email || !password || !employeeId || !department  || !mobile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password (at least 8 characters, at least 1 number, 1 uppercase, 1 special character)
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ success: false, message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character" });
    }

    // Validate mobile number (assuming Indian format)
    if (!validator.isMobilePhone(mobile, "en-IN")) {
      return res.status(400).json({ success: false, message: "Invalid mobile number format" });
    }


    // Check if faculty already exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({ success: false, message: "Faculty member with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty record
    const faculty = new Faculty({ name, email, password: hashedPassword, employeeId, department, mobile });
    await faculty.save();

    res.status(201).json({ success: true, message: "Faculty registered successfully", faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find().select("-password"); // Exclude password field

    if (!facultyList.length) {
      return res.status(404).json({ success: false, message: "No faculty members found" });
    }

    res.status(200).json({ success: true, faculty: facultyList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/**
 * @desc Check server health
 * @route GET /admin/health
 */
export const checkServerHealth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Server is running smoothly",
      uptime: process.uptime(),
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
