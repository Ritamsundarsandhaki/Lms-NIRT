import Student from "../models/student.models.js";
import Faculty from "../models/faculty.model.js";
import Librarian from "../models/librarian.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../lib/sendEmail.js";

/**
 * @desc Send OTP for Password Reset
 * @route POST /auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType) {
      return res.status(400).json({ success: false, message: "Email and user type are required" });
    }

    let userModel;
    if (userType === "student") userModel = Student;
    else if (userType === "faculty") userModel = Faculty;
    else if (userType === "librarian") userModel = Librarian;
    else if (userType === "admin") userModel = Admin;
    else return res.status(400).json({ success: false, message: "Invalid user type" });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
    await user.save();

    // Send OTP email
    const subject = "Password Reset OTP";
    const message = `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`;

    await sendEmail(user.email, subject, message);

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Verify OTP and Reset Password
 * @route POST /auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, userType } = req.body;

    if (!email || !otp || !newPassword || !userType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let userModel;
    if (userType === "student") userModel = Student;
    else if (userType === "faculty") userModel = Faculty;
    else if (userType === "librarian") userModel = Librarian;
    else if (userType === "admin") userModel = Admin;
    else return res.status(400).json({ success: false, message: "Invalid user type" });

    const user = await userModel.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
