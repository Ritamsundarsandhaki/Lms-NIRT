import mongoose from "mongoose";

const bookIssueLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },
    librarianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Librarian", // Make sure you have a model named "Librarian"
    },
    bookCopy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCopy",
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BookIssueLog", bookIssueLogSchema);
