import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import BookController from "../controller/bookController.js";

const BookRouter = express.Router();

BookRouter.post("/add", BookController.addBook);
BookRouter.get("/get-all", BookController.getAllBooks);
BookRouter.patch("/update/:id", BookController.updateBook);
BookRouter.delete("/delete/:id", BookController.deleteBook);
BookRouter.get("/getById/:id", BookController.getBookById);

export default BookRouter;
