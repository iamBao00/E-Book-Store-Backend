import mongoose from "mongoose";

// Review Schema
const ReviewSchema = new mongoose.Schema({
  rating: Number, // 1 to 5 start
  comment: String,
  review_date: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Book Schema
const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    price: { type: Number, required: true },
    publisher: String,
    description: String,
    stock_quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    image: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    is_active: { type: Boolean, default: true },
    reviews: [ReviewSchema], // Embedded review vào book
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", BookSchema);
