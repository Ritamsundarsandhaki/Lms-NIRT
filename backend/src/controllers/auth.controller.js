import Student from "../models/student.models.js";
import Faculty from "../models/faculty.model.js";
import Librarian from "../models/librarian.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../lib/sendEmail.js";





/**
 * @desc Login User
 * @route POST /auth/login
 */
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const userType = req.params.userType?.toLowerCase();
    if (!userType) {
      return res.status(400).json({ success: false, message: "User type is required" });
    }

    let user;
    let isMatch = false;

    if (userType === "student") {
      let { fileNo, password } = req.body;
      if (typeof fileNo !== "string" || typeof password !== "string") {
        return res.status(400).json({ success: false, message: "File number and password are required" });
      }

      fileNo = fileNo.trim();
      user = await Student.findOne({ fileNo });
      if (!user) {
        return res.status(404).json({ success: false, message: "Invalid credentials" });
      }

      isMatch = await bcrypt.compare(password, user.password);

    } else if (["faculty", "librarian", "admin"].includes(userType)) {
      let { email, password } = req.body;
      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }

      email = email.trim().toLowerCase();

      let userModel;
      if (userType === "faculty") userModel = Faculty;
      else if (userType === "librarian") userModel = Librarian;
      else if (userType === "admin") userModel = Admin;

      user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "Invalid credentials" });
      }

      isMatch = await bcrypt.compare(password, user.password);
    } else {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      type:userType,
      token:token,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/**
 * @desc Logout User
 * @route POST /auth/logout
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

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

    // Check if the user has already requested OTP 2 times today
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!user.resetOtpDate || user.resetOtpDate < startOfToday) {
      user.resetOtpCount = 0; // reset if it's a new day
      user.resetOtpDate = now;
    }

    if (user.resetOtpCount >= 2) {
      return res.status(429).json({
        success: false,
        message: "OTP request limit exceeded. Try again tomorrow.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
    user.resetOtpCount += 1;
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
