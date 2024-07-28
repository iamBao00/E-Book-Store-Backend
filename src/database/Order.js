import mongoose from "mongoose";

// Order Detail Schema
const OrderDetailSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  quantity: Number,
});

const AddressSchema = new mongoose.Schema({
  country: String,
  city: String,
  postal_code: String,
  street: String,
});

// Order Schema
const OrderSchema = new mongoose.Schema(
  {
    amount: Number,
    transactionId: String,
    status: { type: String, default: "Processing" }, // Processing, Delivering, Delivered, Cancelled
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderDetails: [OrderDetailSchema], // Nhúng order detail vào order
    address: AddressSchema,
    paymentMethod: { type: String, default: "cash" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
