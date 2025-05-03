import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Student from "../models/student.models.js";
import Librarian from "../models/librarian.model.js";
import Book from "../models/book.models.js";
import Faculty from "../models/faculty.model.js";
import BookCopy from "../models/bookCopy.js";
import BookIssueLog from "../models/bookIssueLog.model.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import {generateNextBookId} from '../lib/bookIdGenerator.js'

/**
 * @desc Librarian Login
 * @route POST /librarian/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find librarian by email
    const librarian = await Librarian.findOne({ email });
    if (!librarian) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, librarian.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: librarian._id, type: "librarian" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: "strict", // Prevent CSRF attack
      secure: process.env.NODE_MODE !== "development", // Use secure cookies in production
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        type: "librarian",
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


export const profile = async (req, res) => {
  try {
    const librarianId = req.userId;

    if (!librarianId) {
      return res.status(400).json({
        success: false,
        message: "Librarian ID is missing from the request.",
      });
    }

    const librarian = await Librarian.findById(librarianId).select("-password");

    if (!librarian) {
      return res.status(404).json({
        success: false,
        message: "Librarian not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Librarian profile fetched successfully.",
      librarian,
      // Optional extras:
      // role: "librarian",
      // fetchedAt: new Date(),
    });
  } catch (error) {
    console.error("Error fetching librarian profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const dashboardData = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await Student.countDocuments();

    // Count total book copies
    const totalBooks = await BookCopy.countDocuments();

    // Count issued books
    const issuedBooks = await BookCopy.countDocuments({ issued: true });

    // Available books = total - issued
    const availableBooks = totalBooks - issuedBooks;

    // Send dashboard stats
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalBooks,
        issuedBooks,
        availableBooks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc Register a new student
 * @route POST /librarian/register-student
 */

export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      fileNo,
      parentName,
      mobile,
      department,
      branch,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !fileNo ||
      !parentName ||
      !mobile ||
      !department ||
      !branch
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
    }

    // Validate file number format (5-digit number)
    if (!/^\d{5}$/.test(fileNo)) {
      return res
        .status(400)
        .json({ success: false, message: "File No must be a 5-digit number" });
    }

    // Validate mobile number format (10-digit number)
    if (!/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Mobile number must be a valid 10-digit number",
        });
    }

    // Validate branch selection
    const allowedBranches = [
      "CSE",
      "ECE",
      "EE",
      "Cyber",
      "Mining",
      "ME",
      "Automobile",
      "Civil",
    ];
    if (!allowedBranches.includes(branch)) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Branch must be one of: ${allowedBranches.join(", ")}`,
        });
    }

    // Check if email is already registered
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A student with this email already exists",
        });
    }

    // Check if file number is already registered
    const existingStudent = await Student.findOne({ fileNo });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Student with this File No already exists",
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student record
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      fileNo,
      parentName,
      mobile,
      department,
      branch,
    });

    // Save student to database
    await student.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Student registered successfully",
        student,
      });
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


export const updateStudentProfile = async (req, res) => {
  try {
    const { name, email, parentName, department, branch, fileNo, mobile } = req.body;

    // Check required field
    if (!fileNo) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID (fileNo) is required" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate mobile if provided
    if (mobile && !/^[6789]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number. Must be a 10-digit Indian number.",
      });
    }

    // Validate branch if provided
    const allowedBranches = [
      "CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"
    ];
    if (branch && !allowedBranches.includes(branch)) {
      return res.status(400).json({
        success: false,
        message: `Branch must be one of: ${allowedBranches.join(", ")}`,
      });
    }

    // Find the student
    const student = await Student.findOne({ fileNo });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check for duplicate email if it's being changed
    if (email && email !== student.email) {
      const emailExists = await Student.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another student",
        });
      }
    }

    // Check for duplicate mobile if it's being changed
    if (mobile && mobile !== student.mobile) {
      const mobileExists = await Student.findOne({ mobile });
      if (mobileExists) {
        return res.status(409).json({
          success: false,
          message: "Mobile number already in use by another student",
        });
      }
    }

    // Update the fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (parentName) student.parentName = parentName;
    if (department) student.department = department;
    if (branch) student.branch = branch;
    if (mobile) student.mobile = mobile;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an Excel file" });
    }

    // Read and parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Uploaded file is empty" });
    }

    let validStudents = [];
    let invalidStudents = [];

    for (const row of rawData) {
      // **Validation Checks**
      if (
        !row.Name ||
        !row.Email ||
        !row.Password ||
        !row.FileNo ||
        !row.ParentName ||
        !row.Mobile ||
        !row.Department ||
        !row.Branch
      ) {
        invalidStudents.push({ row, reason: "Missing required fields" });
        continue;
      }

      if (!validator.isEmail(row.Email)) {
        invalidStudents.push({ row, reason: "Invalid email format" });
        continue;
      }

      if (row.Password.length < 6) {
        invalidStudents.push({
          row,
          reason: "Password must be at least 6 characters long",
        });
        continue;
      }

      if (!/^\d{5}$/.test(row.FileNo)) {
        invalidStudents.push({
          row,
          reason: "File No must be a 5-digit number",
        });
        continue;
      }

      if (!/^\d{10}$/.test(row.Mobile)) {
        invalidStudents.push({
          row,
          reason: "Mobile number must be a valid 10-digit number",
        });
        continue;
      }

      const allowedBranches = [
        "CSE",
        "ECE",
        "EE",
        "Cyber",
        "Mining",
        "ME",
        "Automobile",
        "Civil",
      ];
      if (!allowedBranches.includes(row.Branch)) {
        invalidStudents.push({
          row,
          reason: `Branch must be one of: ${allowedBranches.join(", ")}`,
        });
        continue;
      }

      // Check if student already exists
      const existingStudent = await Student.findOne({ fileNo: row.FileNo });
      if (existingStudent) {
        invalidStudents.push({
          row,
          reason: "Student with this File No already exists",
        });
        continue;
      }

      const hashedPassword = await bcrypt.hash(row.Password, 10);

      validStudents.push({
        name: row.Name,
        email: row.Email,
        password: hashedPassword,
        fileNo: row.FileNo,
        parentName: row.ParentName,
        mobile: row.Mobile,
        department: row.Department,
        branch: row.Branch,
      });
    }

    if (validStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid students to insert. All were either invalid or duplicates.",
        invalidStudents,
      });
    }

    // **Bulk Insert Students**
    await Student.insertMany(validStudents);

    res.status(200).json({
      success: true,
      message: "Students uploaded successfully",
      insertedStudents: validStudents.length,
      invalidStudents,
    });
  } catch (error) {
    console.error("Error uploading students:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Register a new book
 * @route POST /librarian/register-book
 */


// Main book registration controller
export const registerBook = async (req, res) => {
  try {
    const { title, author, details, stock, price, course, branch } = req.body;

    if (
      !title ||
      !author ||
      !details ||
      !stock ||
      !price ||
      !course ||
      !branch
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (isNaN(stock) || stock <= 0 || parseInt(stock) !== Number(stock)) {
      return res
        .status(400)
        .json({ success: false, message: "Stock must be a positive integer" });
    }

    if (stock > 200) {
      return res
        .status(400)
        .json({ success: false, message: "Stock cannot exceed 200 copies" });
    }
    if (isNaN(price) || price < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Price must be a positive number" });
    }

    // Step 1: Create book metadata
    const book = await Book.create({
      title,
      author,
      details,
      price,
      course,
      branch,
    });


    console.log( await generateNextBookId())
    // Step 2: Generate copies
    const copies = [];
    for (let i = 0; i < stock; i++) {
      const bookId = await generateNextBookId();
      copies.push({ bookId, book: book._id, issued: false });
    }



    // Step 3: Save all copies
    const insertedCopies = await BookCopy.insertMany(copies);

    // Step 4: Convert book to plain object and add `books` array manually
    const bookWithCopies = book.toObject();
    bookWithCopies.books = insertedCopies;

    res.status(201).json({
      success: true,
      message: "Book registered with all copies",
      book: bookWithCopies,
    });
  } catch (error) {
    console.error("Error registering book:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const uploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an Excel file" });
    }

    // Read and parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Read the first sheet
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Uploaded file is empty" });
    }

    let validBooks = [];
    let invalidBooks = [];
    const existingTitles = new Set(await Book.find().distinct("title"));
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const row of rawData) {
      const { Title, Author, Details, Stock, Price, Course, Branch } = row;

      // **Validation Checks**
      if (!Title || !Author || !Details || !Stock || !Price || !Course || !Branch) {
        invalidBooks.push({ row, reason: "Missing required fields" });
        continue;
      }

      if (isNaN(Stock) || Stock <= 0 || parseInt(Stock) !== Number(Stock)) {
        invalidBooks.push({ row, reason: "Stock must be a positive integer" });
        continue;
      }

      if (Stock > 200) {
        invalidBooks.push({ row, reason: "Stock cannot exceed 200 copies" });
        continue;
      }

      if (isNaN(Price) || Price < 0) {
        invalidBooks.push({ row, reason: "Price must be a positive number" });
        continue;
      }

      // **Check for Duplicate Titles**
      if (existingTitles.has(Title)) {
        invalidBooks.push({ row, reason: "Duplicate book title in database" });
        continue;
      }

      // Step 1: Create Book Metadata
      const book = await Book.create({
        title: Title,
        author: Author,
        details: Details,
        price: Price,
        course: Course,
        branch: Branch,
      });

      // Step 2: Generate Copies
      let bookInstances = [];
      for (let i = 0; i < Stock; i++) {
        const bookId = await generateNextBookId();  // Use your existing logic to generate the book ID
        bookInstances.push({
          bookId,
          book: book._id,
          issued: false,
        });
      }

      // Step 3: Insert Book Copies
      const insertedCopies = await BookCopy.insertMany(bookInstances);

      // Step 4: Convert book to plain object and add `books` array manually
      const bookWithCopies = book.toObject();
      bookWithCopies.books = insertedCopies;

      validBooks.push(bookWithCopies);
    }

    if (validBooks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid books to insert. All were either invalid or duplicates.",
        invalidBooks,
      });
    }

    res.status(200).json({
      success: true,
      message: "Books uploaded successfully",
      insertedBooks: validBooks.length,
      invalidBooks,
      books: validBooks,
    });
  } catch (error) {
    console.error("Error uploading books:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// updetd book 

export const updateBook = async (req, res) => {
  try {
    const { copyId } = req.params;
    const { title, author, details, stock, price, course, branch } = req.body;

    // Validate fields
    if (!title || !author || !details || !stock || !price || !course || !branch) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const parsedStock = parseInt(stock);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedStock) || parsedStock <= 0) {
      return res.status(400).json({ success: false, message: "Stock must be a positive integer" });
    }

    if (parsedStock > 200) {
      return res.status(400).json({ success: false, message: "Stock cannot exceed 200 copies" });
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number" });
    }

    // Step 1: Find BookCopy by copyId
    const bookCopy = await BookCopy.findOne({bookId:copyId});
    if (!bookCopy) {
      return res.status(404).json({ success: false, message: "Book copy not found" });
    }

    const bookId = bookCopy.book;

    // Step 2: Find the original book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found for this copy" });
    }

    // Step 3: Count current copies
    const currentCopyCount = await BookCopy.countDocuments({ book: bookId });

    if (parsedStock < currentCopyCount) {
      return res.status(400).json({
        success: false,
        message: `Cannot reduce stock. Currently registered copies: ${currentCopyCount}`,
      });
    }

    // Step 4: Add new copies if needed
    const copiesToAdd = parsedStock - currentCopyCount;
    let newCopies = [];

    if (copiesToAdd > 0) {
      const copies = [];
      for (let i = 0; i < copiesToAdd; i++) {
        const newBookId = await generateNextBookId();
        copies.push({ bookId: newBookId, book: book._id, issued: false });
      }
      newCopies = await BookCopy.insertMany(copies);
    }

    // Step 5: Update book info
    book.title = title;
    book.author = author;
    book.details = details;
    book.price = parsedPrice;
    book.course = course;
    book.branch = branch;

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully via BookCopy ID",
      updatedBook,
      addedCopies: newCopies.length,
    });

  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




//   try {
//     const { fileNo, bookIds } = req.body;

//     if (!fileNo || !Array.isArray(bookIds) || bookIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "InvalidInput",
//         message: "File number and an array of book IDs are required."
//       });
//     }

//     // Check if student exists
//     const student = await Student.findOne({ fileNo });
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         error: "StudentNotFound",
//         message: "No student found with the given file number."
//       });
//     }

//     let issuedBooks = [];
//     let failedBooks = [];

//     // Fetch books matching any bookId in the array
//     const books = await Book.find({ "books.bookId": { $in: bookIds } });

//     if (!books || books.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "BooksNotFound",
//         message: "No books found matching the provided IDs."
//       });
//     }

//     // Create a Set of found book IDs
//     const foundBookIds = new Set();
//     books.forEach((book) => {
//       book.books.forEach((b) => foundBookIds.add(b.bookId));
//     });

//     // Identify missing books
//     bookIds.forEach((bookId) => {
//       if (!foundBookIds.has(bookId)) {
//         failedBooks.push({ bookId, reason: "Book not found" });
//       }
//     });

//     // Create a map for quick lookup of available books
//     const bookMap = new Map();
//     books.forEach((book) => {
//       book.books.forEach((b) => {
//         if (bookIds.includes(b.bookId) && !b.issued) {
//           bookMap.set(b.bookId, { book, bookInstance: b });
//         }
//       });
//     });

//     for (const bookId of bookIds) {
//       if (failedBooks.some((b) => b.bookId === bookId)) continue;

//       if (bookMap.has(bookId)) {
//         const { book, bookInstance } = bookMap.get(bookId);
//         bookInstance.issued = true;
//         issuedBooks.push(bookId);
//         student.issuedBooks.push({ bookId, issuedDate: new Date(), returned: false });
//       } else {
//         failedBooks.push({ bookId, reason: "Book already issued" });
//       }
//     }

//     if (issuedBooks.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "NoBooksIssued",
//         message: "No books could be issued. All requested books are either unavailable or already issued.",
//         failedBooks
//       });
//     }

//     // Save changes to student and books
//     await Promise.all([student.save(), ...books.map((book) => book.save())]);

//     res.status(200).json({
//       success: true,
//       message: "Books processed successfully.",
//       issuedBooks,
//       failedBooks,
//     });

//   } catch (error) {
//     console.error("Error issuing books:", error);

//     res.status(500).json({
//       success: false,
//       error: "ServerError",
//       message: "An unexpected error occurred. Please try again later.",
//       details: error.message
//     });
//   }
// };
export const issueBook = async (req, res) => {
  try {
    const { fileNo, employeeId, bookIds, userType} = req.body;
    const librarianId  = req.userId
    if (
      (!fileNo && !employeeId) ||
      !Array.isArray(bookIds) ||
      bookIds.length === 0 ||
      !userType ||
      !librarianId
    ) {
      return res.status(400).json({
        success: false,
        error: "InvalidInput",
        message:
          "User identifier (File No or Employee ID), userType, librarianId, and book IDs are required.",
      });
    }

    // Fetch the user
    let user;
    if (userType === "student") {
      user = await Student.findOne({ fileNo });
    } else if (userType === "faculty") {
      user = await Faculty.findOne({ employeeId });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "UserNotFound",
        message: `No ${userType} found with the provided identifier.`,
      });
    }

    // Fetch librarian
    const librarian = await Librarian.findById(librarianId);
    if (!librarian) {
      return res.status(404).json({
        success: false,
        error: "LibrarianNotFound",
        message: "No librarian found with the provided ID.",
      });
    }

    const issuedBooks = [];
    const failedBooks = [];

    // Fetch book copies by bookId string
    const bookCopies = await BookCopy.find({ bookId: { $in: bookIds } }).populate("book");
    const foundBookIds = new Set(bookCopies.map((copy) => copy.bookId));

    // Track missing bookIds
    for (const bookId of bookIds) {
      if (!foundBookIds.has(bookId)) {
        failedBooks.push({ bookId, reason: "Book not found" });
      }
    }

    for (const copy of bookCopies) {
      if (copy.issued) {
        failedBooks.push({ bookId: copy.bookId, reason: "Already issued" });
        continue;
      }

      // Mark book copy as issued
      copy.issued = true;
      await copy.save();

      // Log issue in BookIssueLog
      await BookIssueLog.create({
        userId: user._id,
        userModel: userType === "student" ? "Student" : "Faculty",
        librarianId,
        bookCopy: copy._id,
        bookId: copy.bookId,
        issueDate: new Date(),
        returned: false,
      });

      issuedBooks.push(copy.bookId);
    }

    if (issuedBooks.length === 0) {
      return res.status(400).json({
        success: false,
        error: "NoBooksIssued",
        message:
          "No books could be issued. All requested books are either unavailable or already issued.",
        failedBooks,
      });
    }

    res.status(200).json({
      success: true,
      message: "Books issued successfully.",
      issuedBooks,
      failedBooks,
      userType,
    });
  } catch (error) {
    console.error("Error issuing books:", error);
    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "An unexpected error occurred. Please try again later.",
      details: error.message,
    });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { fileNo, employeeId, bookIds, userType,} = req.body;
    const librarianId  = req.userId

    if (
      (!fileNo && !employeeId) ||
      !Array.isArray(bookIds) ||
      bookIds.length === 0 ||
      !userType ||
      !librarianId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User identifier (File No or Employee ID), userType, librarianId, and at least one Book ID are required.",
      });
    }

    // Get user
    let user;
    if (userType === "student") {
      user = await Student.findOne({ fileNo });
    } else if (userType === "faculty") {
      user = await Faculty.findOne({ employeeId });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No ${userType} found with the provided identifier.`,
      });
    }

    // Get librarian
    const librarian = await Librarian.findById(librarianId);
    if (!librarian) {
      return res.status(404).json({
        success: false,
        message: "Librarian not found.",
      });
    }

    const returnedBooks = [];
    const notFoundBooks = [];

    for (const inputBookId of bookIds) {
      // Find the BookCopy
      const bookCopy = await BookCopy.findOne({ bookId: inputBookId });

      if (!bookCopy) {
        notFoundBooks.push(inputBookId);
        continue;
      }

      // Find the matching issue log
      const issueLog = await BookIssueLog.findOne({
        userId: user._id,
        userModel: userType === "student" ? "Student" : "Faculty",
        bookCopy: bookCopy._id,
        returned: false,
      });

      if (!issueLog) {
        notFoundBooks.push(inputBookId);
        continue;
      }

      // Mark returned
      issueLog.returned = true;
      issueLog.returnDate = new Date();
      await issueLog.save();

      // Update BookCopy availability
      bookCopy.issued = false;
      await bookCopy.save();


      returnedBooks.push(bookCopy.bookId);
    }

    if (returnedBooks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid issued books found to return.",
        notFoundBooks,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Books returned successfully.",
      returnedBooks,
      notFoundBooks,
      userType,
    });
  } catch (error) {
    console.error("Error returning books:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
};

;

export const searchStudents = async (req, res) => {
  try {
    const { fileNo, name, page = 1, limit = 10 } = req.query;

    if (!fileNo && !name) {
      return res
        .status(400)
        .json({ success: false, message: "Provide fileNo or name for search" });
    }

    let query = {};

    if (fileNo) {
      query.fileNo = fileNo;
    }
    if (name) {
      query.name = new RegExp(name, "i"); // Case-insensitive search
    }

    const students = await Student.find(query)
      .select("-password") // Exclude password for security
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!students.length) {
      return res
        .status(404)
        .json({ success: false, message: "No students found" });
    }

    const totalStudents = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      students,
      pagination: {
        totalStudents,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStudents / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const searchBooks = async (req, res) => {
  try {
    const { bookId, title, page = 1, limit = 10 } = req.query;

    if (!bookId && !title) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Provide bookId or title for search",
        });
    }

    let query = {};

    if (bookId) {
      query["bookId"] = bookId; // Fixed incorrect query field
    }
    if (title) {
      query["title"] = new RegExp(title, "i"); // Case-insensitive search
    }

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!books.length) {
      return res
        .status(404)
        .json({ success: false, message: "No books found" });
    }

    const totalBooks = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        totalBooks,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const { title, author, bookId, page = 1, limit = 10 } = req.query;

    // Step 1: Build filter for Book collection
    let bookFilter = {};
    if (title) bookFilter.title = { $regex: title, $options: "i" };
    if (author) bookFilter.author = { $regex: author, $options: "i" };

    // Step 2: Find books first (no pagination yet)
    const books = await Book.find(bookFilter);

    // Step 3: For each book, find copies (filter by bookId if needed)
    const booksWithCopies = await Promise.all(
      books.map(async (book) => {
        let copyFilter = { book: book._id };
        if (bookId) {
          copyFilter.bookId = { $regex: bookId, $options: "i" };
        }

        const copies = await BookCopy.find(copyFilter);

        // Skip books with no matching copies if filtering by bookId
        if (bookId && copies.length === 0) return null;

        return {
          ...book.toObject(),
          books: copies,
        };
      })
    );

    // Step 4: Filter out nulls (books that had no matching copies)
    const filteredBooks = booksWithCopies.filter((b) => b !== null);

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limit);
    const currentPage = parseInt(page);

    // Step 5: Paginate filtered result
    const paginatedBooks = filteredBooks.slice((currentPage - 1) * limit, currentPage * limit);

    res.status(200).json({
      success: true,
      books: paginatedBooks,
      pagination: {
        totalBooks,
        totalPages,
        currentPage,
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const getBookDetailsByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "bookId is required" });
    }

    // Step 1: Find the specific BookCopy by bookId string (like AA-00239)
    const bookCopy = await BookCopy.findOne({ bookId }).populate('book');

    if (!bookCopy) {
      return res.status(404).json({ success: false, message: "Book copy not found" });
    }

    const book = bookCopy.book;

    // Step 2: Count total number of copies for this book (i.e., stock)
    const totalStock = await BookCopy.countDocuments({ book: book._id });

    // Step 3: Return full book details + stock + specific copy info
    res.status(200).json({
      success: true,
      message: "Book found",
      bookDetails: {
        ...book.toObject(),
        stock: totalStock,
      },
      bookCopy: {
        _id: bookCopy._id,
        bookId: bookCopy.bookId,
        issued: bookCopy.issued,
        createdAt: bookCopy.createdAt,
      },
    });

  } catch (error) {
    console.error("Error finding book by bookId:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { name, email, page = 1, limit = 10 } = req.query; // Get input from query parameters

    // Build filter object based on the input parameters
    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" }; // Case-insensitive search for email
    }

    // Pagination setup
    const skip = (page - 1) * limit;

    // Fetch students based on the filter and pagination
    const students = await Student.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password"); // Exclude password

    // Get total count of students for pagination
    const totalStudents = await Student.countDocuments(filter);

    // Send response with the students data and pagination details
    res.status(200).json({
      success: true,
      students,
      pagination: {
        totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getStudentFullDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch student basic information
    const student = await Student.findById(studentId)
      .select("-password") // Don't send password
      .lean(); // Convert to plain object for easier handling

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Fetch issued books history (if stored in a separate BookIssueLog collection)
    let issuedBooksHistory = [];
    try {
      issuedBooksHistory = await BookIssueLog.find({ userId: student._id }).sort({ issueDate: -1 });
    } catch (err) {
      console.log("No book issue history found separately.", err.message);
    }

    // Month-wise Analytics
    let monthWiseAnalytics = [];
    let typeWiseAnalytics = {};

    // Loop through the issued books history to gather analytics
    issuedBooksHistory.forEach(book => {
      const issueDate = new Date(book.issueDate);
      const yearMonth = `${issueDate.getFullYear()}-${issueDate.getMonth() + 1}`; // Format: "YYYY-MM"

      // Add to month-wise analytics
      if (!monthWiseAnalytics[yearMonth]) {
        monthWiseAnalytics[yearMonth] = 0;
      }
      monthWiseAnalytics[yearMonth] += 1; // Increment the issue count for the month

      // Add to type-wise analytics (assuming 'bookCategory' or similar field exists)
      const bookType = book.details || "Uncategorized"; // Default to 'Uncategorized' if no category
      if (!typeWiseAnalytics[bookType]) {
        typeWiseAnalytics[bookType] = 0;
      }
      typeWiseAnalytics[bookType] += 1; // Increment the count for the book type
    });

    // Convert month-wise analytics into an array of objects for easier display
    const monthWiseData = Object.keys(monthWiseAnalytics).map(key => ({
      month: key,
      issuedCount: monthWiseAnalytics[key]
    }));

    // Analytics based on issuedBooksHistory
    let totalIssued = issuedBooksHistory.length;
    let totalReturned = issuedBooksHistory.filter(book => book.returned).length;
    let totalPending = totalIssued - totalReturned;

    const analytics = {
      totalIssued,
      totalReturned,
      totalPending,
      monthWiseData,
      typeWiseAnalytics,
    };

    res.status(200).json({
      success: true,
      student,
      issuedBooksHistory,
      analytics,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getAllFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      department,
      mobile,
      page = 1,
      limit = 10,
    } = req.query; // Get filter and pagination parameters

    // Build filter object based on query parameters
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (employeeId) {
      filter.employeeId = { $regex: employeeId, $options: "i" };
    }
    if (department) {
      filter.department = { $regex: department, $options: "i" };
    }
    if (mobile) {
      filter.mobile = { $regex: mobile, $options: "i" };
    }

    // Pagination setup
    const skip = (page - 1) * limit;

    // Fetch faculty data with applied filters and pagination
    const facultyList = await Faculty.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password") // Do not send the password
      .sort({ createdAt: -1 }); // Latest created first (optional)

    // Get total count for pagination
    const totalFaculty = await Faculty.countDocuments(filter);

    res.status(200).json({
      success: true,
      facultyList,
      pagination: {
        totalFaculty,
        totalPages: Math.ceil(totalFaculty / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getFacultyFullDetails = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Fetch faculty basic information
    const faculty = await Faculty.findById(facultyId)
      .select("-password") // Don't send password
      .lean(); // Convert to plain object for easier handling

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Fetch issued books history
    let issuedBooksHistory = [];
    try {
      issuedBooksHistory = await BookIssueLog.find({ userId: faculty._id }).sort({ issueDate: -1 });
    } catch (err) {
      console.log("No book issue history found separately for faculty.", err.message);
    }

    // Month-wise and Type-wise Analytics
    let monthWiseAnalytics = {};
    let typeWiseAnalytics = {};

    issuedBooksHistory.forEach(book => {
      const issueDate = new Date(book.issueDate);
      const yearMonth = `${issueDate.getFullYear()}-${issueDate.getMonth() + 1}`; // Format: "YYYY-MM"

      // Month-wise counting
      if (!monthWiseAnalytics[yearMonth]) {
        monthWiseAnalytics[yearMonth] = 0;
      }
      monthWiseAnalytics[yearMonth] += 1;

      // Type-wise counting
      const bookType = book.details || "Uncategorized"; // Adjust this according to your schema
      if (!typeWiseAnalytics[bookType]) {
        typeWiseAnalytics[bookType] = 0;
      }
      typeWiseAnalytics[bookType] += 1;
    });

    const monthWiseData = Object.keys(monthWiseAnalytics).map(key => ({
      month: key,
      issuedCount: monthWiseAnalytics[key],
    }));

    // Basic Analytics
    const totalIssued = issuedBooksHistory.length;
    const totalReturned = issuedBooksHistory.filter(book => book.returned).length;
    const totalPending = totalIssued - totalReturned;

    const analytics = {
      totalIssued,
      totalReturned,
      totalPending,
      monthWiseData,
      typeWiseAnalytics,
    };

    res.status(200).json({
      success: true,
      faculty,
      issuedBooksHistory,
      analytics,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const librarianId = req.user.id; // Assuming you have librarian's ID in req.user (from auth middleware)

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    // Find the librarian by ID
    const librarian = await Librarian.findById(librarianId);
    if (!librarian) {
      return res.status(404).json({ success: false, message: "Librarian not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, librarian.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    librarian.password = hashedPassword;
    await librarian.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const bookTraking = async (req, res) => {
  try {
    const { bookId } = req.params; // bookId is like 'AA-000003'

    // 1. Find BookCopy by bookId (custom ID)
    const bookCopy = await BookCopy.findOne({ bookId }).populate('book');
    if (!bookCopy) {
      return res.status(404).json({ success: false, message: "Book copy not found" });
    }

    const book = bookCopy.book;
    if (!book) {
      return res.status(404).json({ success: false, message: "Book metadata not found for this copy" });
    }

    // 2. Fetch all issue history for this book copy
    const issueHistory = await BookIssueLog.find({ bookId })
      .populate("userId", "name email") 
      .populate("librarianId", "name email") 
      .populate("bookCopy", "bookId issued") 
      .sort({ issueDate: -1 })
      .lean();

    // 3. Prepare analytics
    const totalIssued = issueHistory.length;
    const totalReturned = issueHistory.filter(issue => issue.returned).length;
    const totalPending = totalIssued - totalReturned;

    const monthWiseAnalytics = {};
    issueHistory.forEach(issue => {
      const issueDate = new Date(issue.issueDate);
      const yearMonth = `${issueDate.getFullYear()}-${String(issueDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthWiseAnalytics[yearMonth]) {
        monthWiseAnalytics[yearMonth] = 0;
      }
      monthWiseAnalytics[yearMonth]++;
    });

    const monthWiseData = Object.keys(monthWiseAnalytics).map(month => ({
      month,
      issuedCount: monthWiseAnalytics[month],
    }));

    // 4. Currently issued copy
    const currentlyIssuedCopies = issueHistory
      .filter(issue => !issue.returned)
      .map(issue => ({
        copyId: issue.bookCopy?._id,
        bookId: issue.bookCopy?.bookId,
        issuedTo: {
          name: issue.userId?.name,
          email: issue.userId?.email,
        },
        issuedByLibrarian: {
          name: issue.librarianId?.name,
          email: issue.librarianId?.email,
        },
        issueDate: issue.issueDate,
      }));

    // 5. Send Response
    res.status(200).json({
      success: true,
      book,
      issueHistory,
      analytics: {
        totalIssued,
        totalReturned,
        totalPending,
        monthWiseData,
        currentlyIssuedCopies,
      },
    });

  } catch (error) {
    console.error("Error in bookTraking:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};