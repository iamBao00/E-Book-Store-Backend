import express from "express";
import UserController from "../controller/UserController.js";

import "../strategies/local-strategy.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { User } from "../database/User.js";
const UserRouter = express.Router();

// Đăng kí User
UserRouter.post("/register", UserController.createUser);

// Đăng nhập User
UserRouter.post(
  "/login",
  AuthMiddleware.loginMiddleware,
  UserController.loginUser
);

// Logout
UserRouter.post("/logout", UserController.logoutUser);

// Create admin account (only for admin)
UserRouter.post(
  "/createAdmin",
  AuthMiddleware.ensureAuthenticated,
  AuthMiddleware.ensureRole("admin"),
  UserController.createAdmin
);

// check logged in user
UserRouter.get(
  "/check-auth",
  AuthMiddleware.ensureAuthenticated,
  UserController.checkAuth
);

// check logged in admin
UserRouter.get(
  "/check-auth-admin",
  AuthMiddleware.ensureAuthenticated,
  UserController.checkAuthAdmin
);

// get address
UserRouter.get(
  "/get-address",
  AuthMiddleware.ensureAuthenticated,
  UserController.getAddress
);

// Get list items in Cart
UserRouter.get(
  "/cart",
  AuthMiddleware.ensureAuthenticated,
  UserController.getListCart
);

// Add book to cart
UserRouter.patch(
  "/add-to-cart",
  AuthMiddleware.ensureAuthenticated,
  UserController.addBookToCart
);

// Delete Item in Cart
UserRouter.delete(
  "/cart/delete/:bookId",
  AuthMiddleware.ensureAuthenticated,
  UserController.removeBookFromCart
);

// Update Quantity
UserRouter.patch(
  "/cart/quantity/:bookId",
  AuthMiddleware.ensureAuthenticated,
  UserController.updateQuantity
);

// Get user by id
UserRouter.get(
  "/info/:id",
  AuthMiddleware.ensureAuthenticated,
  async (req, res) => {
    const userId = req.params.id; // Truy xuất userId từ params
    try {
      const user = await User.findById(userId); // Sử dụng await để chờ kết quả trả về

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Get user info successfully",
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role, // Trả về role của người dùng
          address: user.address,
          avatar: user.avatar,
          phone: user.phone,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

export default UserRouter;
