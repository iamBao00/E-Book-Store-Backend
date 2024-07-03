import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AddressSchema = new mongoose.Schema({
  country: String,
  city: String,
  postal_code: String,
  street: String,
});

const CartDetailSchema = new mongoose.Schema({
  quantity: Number,
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
});

const WishListDetailSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  phone: { type: String },
  avatar: { type: String },
  address: [AddressSchema], // Nhúng address vào user
  cart: [CartDetailSchema], // Nhúng cart vào user
  wishlist: [WishListDetailSchema], // Nhúng wishlist vào user
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
