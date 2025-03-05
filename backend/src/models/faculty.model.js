import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true, // Ensures employee ID is unique
    },
    department: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    resetOtp: { type: String }, // OTP for password reset
  otpExpiry: { type: Date }, 
    issuedBooks: [
      {
        bookId: { type: String, required: true },
        issueDate: { type: Date, default: Date.now },
        returnDate: { type: Date },
        returned: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
