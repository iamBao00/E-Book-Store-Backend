import express from "express";
import UserController from "../controller/UserController.js";

import "../strategies/local-strategy.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const UserRouter = express.Router();

// Đăng kí User
UserRouter.post("/register", UserController.createUser);

// Đăng nhập User
// UserRouter.post(
//   "/login",
//   passport.authenticate("local", { session: true }),
//   UserController.loginUser
// );
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

// check logged in
UserRouter.get(
  "/check-auth",
  AuthMiddleware.ensureAuthenticated,
  UserController.checkAuth
);

// Check Cart
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

export default UserRouter;
