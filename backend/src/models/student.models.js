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
    resetOtpCount: {
      type: Number,
      default: 0,
    },
    resetOtpDate: {
      type: Date,
    },    
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "EE", "Cyber", "Mining", "ME", "Automobile", "Civil"], // ✅ Corrected spelling
    },
    resetOtp: { type: String }, // OTP for password reset
    otpExpiry: { type: Date }, 
  },
  { timestamps: true } // ✅ Adds createdAt and updatedAt fields automatically
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
