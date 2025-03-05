import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
    fileNo: {
      type: String,
      required: true,
      unique: true, // Ensures fileNo is unique
    },
    parentName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"], // ✅ Corrected spelling
    },
    resetOtp: { type: String }, // OTP for password reset
    otpExpiry: { type: Date }, 
    issuedBooks: [
      {
        bookId: { type: String, require:true},
        issueDate: { type: Date, default: Date.now },
        returnDate: { type: Date },
        returned: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt fields automatically
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
