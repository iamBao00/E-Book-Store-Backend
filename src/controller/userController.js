import { User } from "../database/User.js";

// Chưa validate req.body
const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // check username exist?
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check email exist?
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // check username exist?
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check email exist?
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const role = "admin";
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = (req, res) => {
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role, // Trả về role của người dùng
    },
  });
};

const checkAuth = (req, res) => {
  res.status(200).json({
    message: "Logged in",
    user: {
      _id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role, // Trả về role của người dùng
    },
  });
};

const checkAuthAdmin = (req, res) => {
  if (req.user.role !== "admin")
    return res
      .status(400)
      .json({ message: "You need admin account to access this resource" });
  else
    return res.status(200).json({
      message: "Logged in",
      user: {
        _id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role, // Trả về role của người dùng
      },
    });
};

// get List Cart of User
const getListCart = (req, res) => {
  return res.status(200).send(req.user.cart);
};

const addBookToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const user = req.user;

    // Check if the book already exists in the cart
    const existingCartItem = user.cart.find(
      (item) => String(item.book_id) === String(bookId)
    );

    if (existingCartItem) {
      // Update quantity if the book already exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new item to cart if the book doesn't exist
      user.cart.push({ book_id: bookId, quantity });
    }

    await user.save();

    res.status(201).json({ message: "Book added to cart successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeBookFromCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by the AuthMiddleware
    const bookId = req.params.bookId;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the book from the cart
    user.cart = user.cart.filter((item) => item.book_id.toString() !== bookId);

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Book removed from cart" });
  } catch (err) {
    console.error("Error removing book from cart:", err);
    return res.status(500).json({ message: err });
  }
};

const updateQuantity = async (req, res) => {
  const userId = req.user.id; // userId được lấy từ AuthMiddleware
  const { bookId } = req.params;
  const { quantity } = req.body;

  try {
    // Tìm user theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm item trong giỏ hàng theo bookId
    const cartItem = user.cart.find(
      (item) => item.book_id.toString() === bookId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    // Nếu số lượng mới là 0, xóa item khỏi giỏ hàng
    if (quantity === 0) {
      user.cart = user.cart.filter(
        (item) => item.book_id.toString() !== bookId
      );
    } else {
      // Cập nhật số lượng mới
      cartItem.quantity = quantity;
    }

    // Lưu lại thay đổi
    await user.save();

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAddress = async (req, res) => {
  return res.status(200).send(req.user.address);
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

const UserController = {
  createUser,
  loginUser,
  getListCart,
  createAdmin,
  addBookToCart,
  checkAuth,
  checkAuthAdmin,
  removeBookFromCart,
  updateQuantity,
  getAddress,
  logoutUser,
};

export default UserController;
