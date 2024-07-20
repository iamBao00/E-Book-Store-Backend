import express from "express";
import UserController from "../controller/UserController.js";

import "../strategies/local-strategy.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const UserRouter = express.Router();

// Đăng kí User
UserRouter.post("/register", UserController.createUser);

// Đăng nhập User
UserRouter.post(
  "/login",
  AuthMiddleware.loginMiddleware,
  UserController.loginUser
);

// Create admin account (only for owner)
UserRouter.post(
  "/createAdmin",
  AuthMiddleware.ensureAuthenticated,
  AuthMiddleware.ensureRole("owner"),
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

export default UserRouter;
