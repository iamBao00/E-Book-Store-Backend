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

// get List Cart of User
const getListCart = (req, res) => {
  return res.status(200).send(req.user.cart);
};

// get List Cart of User
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

const UserController = {
  createUser,
  loginUser,
  getListCart,
  createAdmin,
  addBookToCart,
  checkAuth,
};

export default UserController;
