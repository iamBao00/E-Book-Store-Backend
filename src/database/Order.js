import mongoose from "mongoose";

// Order Detail Schema
const OrderDetailSchema = new mongoose.Schema({
  book_id: { type: Schema.Types.ObjectId, ref: "Book" },
  quantity: Number,
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  amount: Number,
  transactionId: String,
  status: String,
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  orderDetails: [OrderDetailSchema], // Nhúng order detail vào order
});

module.exports = mongoose.model("Order", OrderSchema);
