import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import BookController from "../controller/BookController.js";
import { Book } from "../database/Book.js";

const BookRouter = express.Router();

BookRouter.post("/add", BookController.addBook);
BookRouter.get("/get-all", BookController.getAllBooks);
BookRouter.get("/get-all-active", BookController.getAllActiveBooks);
BookRouter.patch("/update/:id", BookController.updateBook);
BookRouter.delete("/delete/:id", BookController.deleteBook);
BookRouter.get("/getById/:id", BookController.getBookById);

// Add a review to a book
BookRouter.post(
  "/review/:bookId",
  AuthMiddleware.ensureAuthenticated,
  BookController.addReview
);

// Edit a review of a book
BookRouter.patch(
  "/review/:bookId",
  AuthMiddleware.ensureAuthenticated,
  BookController.editReview
);

// Delete a review of a book
// Delete a review of a book
BookRouter.delete(
  "/review/:bookId",
  AuthMiddleware.ensureAuthenticated,
  BookController.deleteReview
);

// BookRouter.js
BookRouter.get("/get-best-seller", async (req, res) => {
  try {
    // Fetch the top 10 best-selling books, sorted by 'sold' in descending order
    const bestSellers = await Book.find().sort({ sold: -1 }).limit(10).exec();

    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Error fetching best-sellers:", error);
    res.status(500).json({ message: error.message });
  }
});

export default BookRouter;
