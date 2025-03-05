import mongoose from "mongoose";

// Function to generate a unique 5-digit book ID
const generateBookId = async () => {
  let uniqueId;
  let exists = true;

  while (exists) {
    uniqueId = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
    exists = await mongoose.models.Book.findOne({ "books.bookId": uniqueId }); // Check if it already exists
  }

  return uniqueId;
};

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author:{type:String, required:true},
  details: { type: String, required: true },
  price: { type: Number, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },

  // ✅ Store multiple books inside an array
  books: [
    {
      bookId: { type: String, unique: true, required: true },
      issued: { type: Boolean, default: false }, // Track book availability
    },
  ],
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;
