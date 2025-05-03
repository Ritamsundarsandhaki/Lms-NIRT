import mongoose from "mongoose";
import bcrypt from "bcrypt";

const librarianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  libraryName: { type: String, required: true },
  role: { type: String, default: "librarian" }, // Default role
  isApproved: { type: Boolean, default: false }, // Admin approval status
  resetOtp: { type: String }, // OTP for password reset
  otpExpiry: { type: Date }, 
  resetOtpCount: {
    type: Number,
    default: 0,
  },
  resetOtpDate: {
    type: Date,
  },
}, { timestamps: true });


// ✅ Compare passwords for login
librarianSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Add history entry
librarianSchema.methods.addHistory = async function (action, details) {
  this.history.push({ action, details });
  await this.save();
};

const Librarian = mongoose.model("Librarian", librarianSchema);
export default Librarian;
