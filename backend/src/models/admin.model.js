import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin"], default: "Admin" }, // Ensuring only "Admin" role
  resetOtp: { type: String }, // OTP for password reset
  otpExpiry: { type: Date }, 
  resetOtpCount: {
    type: Number,
    default: 0,
  },
  resetOtpDate: {
    type: Date,
  },
  
  createdAt: { type: Date, default: Date.now },
});

// ✅ Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password for login
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
