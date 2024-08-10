import { Order } from "../database/Order.js";
import { User } from "../database/User.js";
import { Book } from "../database/Book.js";
// Function to place an order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes req.user contains authenticated user information
    const { paymentMethod, address, phoneNumber } = req.body;
    let isPaid = false;
    if (paymentMethod === "paypal") isPaid = true;

    // Fetch user to get cart items
    const user = await User.findById(userId).populate("cart.book_id");

    if (!user || user.cart.length === 0) {
      return res.status(401).json({ message: "Cart is empty" });
    }

    // Check stock quantities
    for (let item of user.cart) {
      if (item.book_id.stock_quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for book: ${item.book_id.title}`,
        });
      }
    }

    // Calculate total amount
    const totalAmount = user.cart.reduce((acc, item) => {
      return acc + item.book_id.price * item.quantity;
    }, 0);

    // Create order details from cart items
    const orderDetails = user.cart.map((item) => ({
      book_id: item.book_id._id,
      quantity: item.quantity,
    }));

    // Create new order
    const newOrder = new Order({
      amount: totalAmount,
      transactionId: "", // This would come from payment gateway if integrated
      status: "Processing",
      user_id: userId,
      orderDetails,
      address,
      paymentMethod,
      phoneNumber,
      isPaid,
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    // Update stock quantities and sold counts
    for (let item of user.cart) {
      const book = await Book.findById(item.book_id._id);
      book.stock_quantity -= item.quantity;
      book.sold += item.quantity;
      await book.save();
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  const user_id = req.user._id;
  console.log(user_id);

  try {
    // Find orders by user_id and sort by createdAt in descending order
    const orders = await Order.find({ user_id })
      .populate("orderDetails.book_id") // Optionally populate book details if needed
      .populate("user_id") // Optionally populate user details if needed
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    // Check if orders are found
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    // Send the orders back in the response
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const user_id = req.user._id;
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate(
      "orderDetails.book_id"
    );

    if (order.status !== "Processing") {
      return res.status(400).send({ msg: "Can not cancel this order" });
    }

    // Update the stock quantities and sold counts
    for (let item of order.orderDetails) {
      const book = await Book.findById(item.book_id._id);
      book.stock_quantity += item.quantity;
      book.sold -= item.quantity;
      await book.save();
    }

    order.status = "Cancelled";
    await order.save();
    return res.status(200).json({ order, message: "Order was canceled" });
  } catch (error) {
    console.error("Error cancel order:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    // Build the query object
    let query = {};
    if (status) {
      query.status = status;
    }

    // Find orders based on the query and sort by createdAt in descending order
    const orders = await Order.find(query)
      .populate("orderDetails.book_id") // Populate book details
      .populate("user_id") // Populate user details
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec(); // Execute the query

    // Check if orders are found
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    // Send the orders back in the response
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;
    console.log("Requested Status:", status); // Debugging: Check the status value

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ msg: "Order not found" });
    }

    // Implement status update rules
    switch (order.status) {
      case "Cancelled":
        return res.status(400).send({ msg: "Cannot update a cancelled order" });
      case "Processing":
        if (status !== "Cancelled" && status !== "Delivering") {
          return res
            .status(400)
            .send({ msg: "Invalid status update for Processing order" });
        }
        if (status === "Cancelled") {
          // Update the stock quantities and sold counts if the order is cancelled
          await order.populate("orderDetails.book_id");
          for (let item of order.orderDetails) {
            const book = await Book.findById(item.book_id._id);
            book.stock_quantity += item.quantity;
            book.sold -= item.quantity;
            await book.save();
          }
        }
        break;
      case "Delivering":
        if (status !== "Delivered") {
          return res
            .status(400)
            .send({ msg: "Invalid status update for Delivering order" });
        }
        break;
      case "Delivered":
        return res.status(400).send({ msg: "Cannot update a delivered order" });
      default:
        return res.status(400).send({ msg: "Invalid order status" });
    }

    // Update the order status
    order.status = status;
    await order.save();
    return res.status(200).json({ order, message: "Status Updated" });
  } catch (error) {
    console.error("Status Update Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const OrderController = {
  placeOrder,
  getOrderHistory,
  cancelOrder,
  getOrders,
  updateOrderStatus,
};

export default OrderController;
