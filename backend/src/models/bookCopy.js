import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  issued: { type: Boolean, default: false },
  isTampered: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("BookCopy", bookCopySchema);
