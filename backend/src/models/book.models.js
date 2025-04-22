import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);
