import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import Student from "../models/student.models.js";
import Librarian from "../models/librarian.model.js";
import Book from "../models/book.models.js";
import Faculty from "../models/faculty.model.js";
import mongoose from "mongoose";
import xlsx from "xlsx";

/**
 * @desc Librarian Login
 * @route POST /librarian/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find librarian by email
    const librarian = await Librarian.findOne({ email });
    if (!librarian) {
      return res.status(404).json({ success: false, message: "Invalid username or password" });
    }

    // Check password
    const isMatch = bcrypt.compare(password, librarian.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
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

    res.status(200).json({ success: true, message: "Login successful" ,type:"librarian" ,token});

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
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const profile = async (req, res) => {
  try {
    const librarian = await Librarian.findById( req.librarian._id).select("-password");
    if (!librarian) {
      return res.status(404).json({ success: false, message: "Librarian not found" });
    }
    res.status(200).json({ success: true, librarian });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const dashboardData = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await Student.countDocuments();

    // Fetch all books to compute total, issued, and available
    const books = await Book.find();
    let totalBooks = 0;
    let issuedBooks = 0;
    let availableBooks = 0;

    books.forEach((book) => {
      totalBooks += book.books.length;
      book.books.forEach((b) => {
        if (b.issued) {
          issuedBooks++;
        } else {
          availableBooks++;
        }
      });
    });

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
    const { name, email, password, fileNo, parentName, mobile, department, branch } = req.body;

    // Validate required fields
    if (!name || !email || !password || !fileNo || !parentName || !mobile || !department || !branch) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // Validate file number format (5-digit number)
    if (!/^\d{5}$/.test(fileNo)) {
      return res.status(400).json({ success: false, message: "File No must be a 5-digit number" });
    }

    // Validate mobile number format (10-digit number)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be a valid 10-digit number" });
    }

    // Validate branch selection
    const allowedBranches = ["CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"];
    if (!allowedBranches.includes(branch)) {
      return res.status(400).json({ success: false, message: `Branch must be one of: ${allowedBranches.join(", ")}` });
    }

    // Check if email is already registered
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "A student with this email already exists" });
    }

    // Check if file number is already registered
    const existingStudent = await Student.findOne({ fileNo });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Student with this File No already exists" });
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

    res.status(201).json({ success: true, message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};





export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an Excel file" });
    }

    // Read and parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res.status(400).json({ success: false, message: "Uploaded file is empty" });
    }

    let validStudents = [];
    let invalidStudents = [];

    for (const row of rawData) {
      // **Validation Checks**
      if (!row.Name || !row.Email || !row.Password || !row.FileNo || !row.ParentName || !row.Mobile || !row.Department || !row.Branch) {
        invalidStudents.push({ row, reason: "Missing required fields" });
        continue;
      }

      if (!validator.isEmail(row.Email)) {
        invalidStudents.push({ row, reason: "Invalid email format" });
        continue;
      }

      if (row.Password.length < 6) {
        invalidStudents.push({ row, reason: "Password must be at least 6 characters long" });
        continue;
      }

      if (!/^\d{5}$/.test(row.FileNo)) {
        invalidStudents.push({ row, reason: "File No must be a 5-digit number" });
        continue;
      }

      if (!/^\d{10}$/.test(row.Mobile)) {
        invalidStudents.push({ row, reason: "Mobile number must be a valid 10-digit number" });
        continue;
      }

      const allowedBranches = ["CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"];
      if (!allowedBranches.includes(row.Branch)) {
        invalidStudents.push({ row, reason: `Branch must be one of: ${allowedBranches.join(", ")}` });
        continue;
      }

      // Check if student already exists
      const existingStudent = await Student.findOne({ fileNo: row.FileNo });
      if (existingStudent) {
        invalidStudents.push({ row, reason: "Student with this File No already exists" });
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
        message: "No valid students to insert. All were either invalid or duplicates.",
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
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




/**
 * @desc Register a new book
 * @route POST /librarian/register-book
 */
export const registerBook = async (req, res) => {
  try {
    const { title, author, details, stock, price, course, branch } = req.body;

    // Validate input fields
    if (!title || !author || !details || !stock || !price || !course || !branch) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate stock and price
    if (isNaN(stock) || stock <= 0 || parseInt(stock) !== Number(stock)) {
      return res.status(400).json({ success: false, message: "Stock must be a positive integer" });
    }
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number" });
    }

    // Generate unique book IDs
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const bookIdSet = new Set();
    const books = [];

    while (bookIdSet.size < stock) {
      const randomLetter1 = letters[Math.floor(Math.random() * letters.length)];
      const randomLetter2 = letters[Math.floor(Math.random() * letters.length)];
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number (1000-9999)
      const newBookId = `${randomLetter1}${randomLetter2}${randomNumber}`;

      // Ensure uniqueness within the current batch
      if (!bookIdSet.has(newBookId)) {
        bookIdSet.add(newBookId);
        books.push({
          bookId: newBookId,
          title,
          author,
          details,
          price,
          course,
          branch,
          issued: false,
        });
      }
    }

    // Insert into database
    const book = new Book({ title, details, stock, price, course, branch, books,author });
    await book.save();

    res.status(201).json({ success: true, message: "Book registered successfully", book });
  } catch (error) {
    console.error("Error registering book:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




export const uploadBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an Excel file" });
    }

    // Read and parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Read first sheet
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res.status(400).json({ success: false, message: "Uploaded file is empty" });
    }

    let validBooks = [];
    let invalidBooks = [];
    const bookIdSet = new Set();
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const row of rawData) {
      // **Validation Checks**
      if (!row.Title || !row.Author || !row.Details || !row.Stock || !row.Price || !row.Course || !row.Branch) {
        invalidBooks.push({ row, reason: "Missing required fields" });
        continue;
      }

      if (isNaN(row.Stock) || row.Stock <= 0 || parseInt(row.Stock) !== Number(row.Stock)) {
        invalidBooks.push({ row, reason: "Stock must be a positive integer" });
        continue;
      }

      if (isNaN(row.Price) || row.Price < 0) {
        invalidBooks.push({ row, reason: "Price must be a positive number" });
        continue;
      }

      // **Generate Unique Book IDs**
      let bookInstances = [];
      for (let i = 0; i < row.Stock; i++) {
        let newBookId;
        do {
          const randomLetter1 = letters[Math.floor(Math.random() * letters.length)];
          const randomLetter2 = letters[Math.floor(Math.random() * letters.length)];
          const randomNumber = Math.floor(1000 + Math.random() * 9000);
          newBookId = `${randomLetter1}${randomLetter2}${randomNumber}`;
        } while (bookIdSet.has(newBookId)); // Ensure uniqueness

        bookIdSet.add(newBookId);
        bookInstances.push({
          bookId: newBookId,
          title: row.Title,
          author: row.Author,
          details: row.Details,
          price: row.Price,
          course: row.Course,
          branch: row.Branch,
          issued: false,
        });
      }

      // **Prepare valid book data**
      validBooks.push({
        title: row.Title,
        author: row.Author,
        details: row.Details,
        stock: row.Stock,
        price: row.Price,
        course: row.Course,
        branch: row.Branch,
        books: bookInstances,
      });
    }

    // **Check for Duplicate Titles**
    const existingTitles = new Set(await Book.find().distinct("title"));
    validBooks = validBooks.filter((book) => {
      if (existingTitles.has(book.title)) {
        invalidBooks.push({ title: book.title, reason: "Duplicate book title in database" });
        return false;
      }
      return true;
    });

    if (validBooks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid books to insert. All were either invalid or duplicates.",
        invalidBooks,
      });
    }

    // **Bulk Insert Books**
   let book =  await Book.insertMany(validBooks);

   console.log(book)
    res.status(200).json({
      success: true,
      message: "Books uploaded successfully",
      insertedBooks: validBooks.length,
      invalidBooks,
      book
    });
  } catch (error) {
    console.error("Error uploading books:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




  // export const issueBook = async (req, res) => {
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
      const { fileNo, employeeId, bookIds, userType } = req.body;
  
      if ((!fileNo && !employeeId) || !Array.isArray(bookIds) || bookIds.length === 0 || !userType) {
        return res.status(400).json({
          success: false,
          error: "InvalidInput",
          message: "User identifier (File No or Employee ID), userType, and book IDs are required.",
        });
      }
  
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
  
      let issuedBooks = [];
      let failedBooks = [];
  
      // Fetch books matching any bookId in the array
      const books = await Book.find({ "books.bookId": { $in: bookIds } });
  
      if (!books || books.length === 0) {
        return res.status(404).json({
          success: false,
          error: "BooksNotFound",
          message: "No books found matching the provided IDs.",
        });
      }
  
      // Create a Set of found book IDs
      const foundBookIds = new Set();
      books.forEach((book) => {
        book.books.forEach((b) => foundBookIds.add(b.bookId));
      });
  
      // Identify missing books
      bookIds.forEach((bookId) => {
        if (!foundBookIds.has(bookId)) {
          failedBooks.push({ bookId, reason: "Book not found" });
        }
      });
  
      // Create a map for quick lookup of available books
      const bookMap = new Map();
      books.forEach((book) => {
        book.books.forEach((b) => {
          if (bookIds.includes(b.bookId) && !b.issued) {
            bookMap.set(b.bookId, { book, bookInstance: b });
          }
        });
      });
  
      for (const bookId of bookIds) {
        if (failedBooks.some((b) => b.bookId === bookId)) continue;
  
        if (bookMap.has(bookId)) {
          const { book, bookInstance } = bookMap.get(bookId);
          bookInstance.issued = true;
          issuedBooks.push(bookId);
          user.issuedBooks.push({ bookId, issuedDate: new Date(), returned: false });
        } else {
          failedBooks.push({ bookId, reason: "Book already issued" });
        }
      }
  
      if (issuedBooks.length === 0) {
        return res.status(400).json({
          success: false,
          error: "NoBooksIssued",
          message: "No books could be issued. All requested books are either unavailable or already issued.",
          failedBooks,
        });
      }
  
      // Save changes to user and books
      await Promise.all([user.save(), ...books.map((book) => book.save())]);
  
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
      const { fileNo, employeeId, bookIds, userType } = req.body;
  
      if ((!fileNo && !employeeId) || !Array.isArray(bookIds) || bookIds.length === 0 || !userType) {
        return res.status(400).json({
          success: false,
          message: "User identifier (File No or Employee ID), userType, and at least one Book ID are required.",
        });
      }
  
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
  
      let returnedBooks = [];
      let notFoundBooks = [];
  
      for (const bookId of bookIds) {
        const bookIndex = user.issuedBooks.findIndex((b) => b.bookId == bookId && !b.returned);
        if (bookIndex === -1) {
          notFoundBooks.push(bookId);
          continue;
        }
  
        user.issuedBooks[bookIndex].returned = true;
        user.issuedBooks[bookIndex].returnDate = new Date();
        returnedBooks.push(bookId);
      }
  
      await user.save();
  
      if (returnedBooks.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No books found in issued list or already returned.",
          notFoundBooks,
        });
      }
  
      // Update book records
      const books = await Book.find({ "books.bookId": { $in: returnedBooks } });
  
      books.forEach((book) => {
        book.books.forEach((b) => {
          if (returnedBooks.includes(b.bookId.toString())) {
            b.issued = false;
          }
        });
      });
  
      await Promise.all(books.map((book) => book.save()));
  
      res.status(200).json({
        success: true,
        message: "Books returned successfully.",
        returnedBooks,
        notFoundBooks,
        userType,
      });
    } catch (error) {
      console.error("Error returning books:", error);
      res.status(500).json({ success: false, message: "Server error. Please try again.", error: error.message });
    }
  };
  

export const searchStudents = async (req, res) => {
    try {
      const { fileNo, name, page = 1, limit = 10 } = req.query;
  
      if (!fileNo && !name) {
        return res.status(400).json({ success: false, message: "Provide fileNo or name for search" });
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
        return res.status(404).json({ success: false, message: "No students found" });
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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  export const searchBooks = async (req, res) => {
    try {
      const { bookId, title, page = 1, limit = 10 } = req.query;
  
      if (!bookId && !title) {
        return res.status(400).json({ success: false, message: "Provide bookId or title for search" });
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
        return res.status(404).json({ success: false, message: "No books found" });
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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  

  export const getAllBooks = async (req, res) => {
    try {
      const { title, author, page = 1, limit = 10 } = req.query; // Get input from query parameters
  
      // Build filter object based on the input parameters
      let filter = {};
      if (title) {
        filter.title = { $regex: title, $options: "i" }; // Case-insensitive search for title
      }
      if (author) {
        filter.author = { $regex: author, $options: "i" }; // Case-insensitive search for author
      }
  
      // Pagination setup
      const skip = (page - 1) * limit;
      
      // Fetch books based on the filter and pagination
      const books = await Book.find(filter).skip(skip).limit(parseInt(limit));
  
      // Get total count of books for pagination
      const totalBooks = await Book.countDocuments(filter);
  
      // Send response with the books data and pagination details
      res.status(200).json({
        success: true,
        books,
        pagination: {
          totalBooks,
          totalPages: Math.ceil(totalBooks / limit),
          currentPage: parseInt(page),
          perPage: parseInt(limit),
        }
      });
    } catch (error) {
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
    const students = await Student.find(filter).skip(skip).limit(parseInt(limit)).select("-password"); // Exclude password

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
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
