import mongoose from "mongoose";

// Order Detail Schema
const OrderDetailSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  quantity: Number,
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  amount: Number,
  transactionId: String,
  status: String, // Processing, Confirmed, Delivered, Cancelled
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDetails: [OrderDetailSchema], // Nhúng order detail vào order
});

export const Order = mongoose.model("Order", OrderSchema);
