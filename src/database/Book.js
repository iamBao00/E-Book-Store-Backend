import mongoose from "mongoose";

// Review Schema
const ReviewSchema = new Schema({
  rating: Number,
  comment: String,
  review_date: Date,
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
});

// Book Schema
const BookSchema = new Schema({
  title: String,
  author: String,
  price: Number,
  publisher: String,
  year_published: Number,
  description: String,
  stock_quantity: Number,
  image: String,
  category_id: { type: Schema.Types.ObjectId, ref: "Category" },
  is_active: Boolean,
  reviews: [ReviewSchema], // Nhúng review vào book
});

module.exports = mongoose.model("Book", BookSchema);
