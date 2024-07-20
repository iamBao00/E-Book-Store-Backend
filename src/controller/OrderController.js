import { Order } from "../database/Order.js";
import { User } from "../database/User.js";
// Function to place an order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes req.user contains authenticated user information
    const { paymentMethod, address } = req.body;

    // Fetch user to get cart items
    const user = await User.findById(userId).populate("cart.book_id");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
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
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: error });
  }
};

const getOrderHistory = async (req, res) => {
  const user_id = req.user._id;
  console.log(user_id);
  try {
    // Find orders by user_id
    const orders = await Order.find({ user_id })
      .populate("orderDetails.book_id") // Optionally populate book details if needed
      .populate("user_id") // Optionally populate user details if needed
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
    const order = await Order.findById(orderId);

    if (order.status !== "Processing") {
      return res.status(400).send({ msg: "Can not cancel this order" });
    }
    order.status = "Cancelled";
    await order.save();
    return res.status(200).json({ order, message: "Order was canceled" });
  } catch (error) {
    console.error("Error cancel order:", err);
    return res.status(500).json({ message: err });
  }
};

const OrderController = {
  placeOrder,
  getOrderHistory,
  cancelOrder,
};

export default OrderController;
