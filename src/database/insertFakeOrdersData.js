import mongoose from "mongoose";
import { Book } from "./Book.js";
import { User } from "./User.js";
import { Order } from "./Order.js";
import { faker } from "@faker-js/faker";

mongoose.connect("mongodb://localhost/book_store");

const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateFakeOrders = async () => {
  try {
    // Fetch books from the database
    const books = await Book.find().exec();

    // Fetch users with role 'user'
    const users = await User.find({ role: "user" }).exec();

    if (books.length === 0 || users.length === 0) {
      console.log("No books or users found in the database.");
      return;
    }

    // Generate fake orders
    const orders = [];
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const orderDetails = [];
      const numItems = Math.floor(Math.random() * 5) + 1; // Random number of items in the order

      for (let j = 0; j < numItems; j++) {
        const book = books[Math.floor(Math.random() * books.length)];
        orderDetails.push({
          book_id: book._id,
          quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
        });
      }

      const totalAmount = orderDetails.reduce((sum, detail) => {
        const book = books.find(
          (b) => b._id.toString() === detail.book_id.toString()
        );
        return sum + (book ? book.price * detail.quantity : 0);
      }, 0);

      const order = new Order({
        amount: totalAmount,
        status: "Processing",
        user_id: user._id,
        orderDetails,
        address: {
          country: faker.location.country(),
          city: faker.location.city(),
          postal_code: faker.location.zipCode(),
          street: faker.location.streetAddress(),
        },
        paymentMethod: "cash",
        phoneNumber: "0123456789",
        isPaid: false,
        createdAt: getRandomDate(new Date(2024, 6, 1), new Date()), // Random date between Jan 1, 2024 and now
      });

      orders.push(order);
    }

    // Save orders to the database
    await Order.insertMany(orders);

    // Update stock quantities and sold counts
    for (let order of orders) {
      for (let detail of order.orderDetails) {
        const book = await Book.findById(detail.book_id);
        if (book) {
          book.stock_quantity -= detail.quantity;
          book.sold += detail.quantity;
          await book.save();
        }
      }
    }

    console.log("Fake orders generated and saved successfully.");
  } catch (error) {
    console.error("Error generating fake orders:", error);
  } finally {
    mongoose.disconnect();
  }
};

generateFakeOrders();
