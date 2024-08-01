import express from "express";
import UserController from "../controller/UserController.js";
import { sendEmail } from "../config/maile.js";
import crypto from "crypto";
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

// Get phone number
UserRouter.get(
  "/get-phone",
  AuthMiddleware.ensureAuthenticated,
  async (req, res) => {
    return res.status(200).json({ phoneNumber: req.user.phone });
  }
);

UserRouter.put(
  "/update/:id",
  AuthMiddleware.ensureAuthenticated,
  async (req, res) => {
    const userId = req.params.id; // Get userId from params
    const { email, phone, avatar, address } = req.body; // Extract fields from request body

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: { email, phone, avatar, address },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User information updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

UserRouter.post("/test-send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in /test-send-email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

UserRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    // Tạo token reset mật khẩu
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token hết hạn sau 1 giờ
    console.log(user);
    await user.save();

    // Gửi email với link reset mật khẩu
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`;

    await sendEmail(user.email, "Password Reset Request", message);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in /forgot-password:", error); // Log lỗi ra console
    res.status(500).json({ message: "An error occurred." });
  }
});

UserRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in /reset-password/:token:", error); // Log lỗi ra console
    res.status(500).json({ message: "An error occurred." });
  }
});

export default UserRouter;
