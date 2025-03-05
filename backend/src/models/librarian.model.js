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
  // ✅ History of actions
  history: [
    {
      action: { type: String, required: true }, // e.g., "Added Book", "Issued Book", etc.
      details: { type: String }, // Optional details about the action
      timestamp: { type: Date, default: Date.now } // Action timestamp
    }
  ],
}, { timestamps: true });

// ✅ Hash password before saving
librarianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

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
