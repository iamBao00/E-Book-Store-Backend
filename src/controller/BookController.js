import { Book } from "../database/Book.js";
import { Category } from "../database/Category.js";

const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      price,
      publisher,
      description,
      stock_quantity,
      image,
      category_id,
      is_active,
    } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      publisher,
      description,
      stock_quantity,
      image,
      category_id,
      is_active,
    });

    await newBook.save();
    res.status(201).send("Book added successfully");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Phương thức lấy tất cả sách
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    const booksWithCategoryName = await Promise.all(
      books.map(async (book) => {
        const category = await Category.findById(book.category_id).select(
          "name"
        );
        return {
          ...book.toObject(),
          category_name: category ? category.name : "Unknown",
        };
      })
    );

    res.status(200).json(booksWithCategoryName);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// Phương thức cập nhật sách
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      price,
      publisher,
      description,
      stock_quantity,
      image,
      category_id,
      is_active,
    } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        price,
        publisher,
        description,
        stock_quantity,
        image,
        category_id,
        is_active,
      },
      { new: true } // Trả về sách đã được cập nhật
    );

    if (!updatedBook) {
      return res.status(404).send({ msg: "Book not found" });
    }

    return res.status(200).send(updatedBook);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const book = await Book.findOneAndDelete({ _id: id });
    console.log(book);
    if (!book) return res.status(400).send("BookId not found");
    return res.status(200).send("Book deleted successfully");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: "reviews.user_id",
      select: "username",
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Phương thức thêm review cho sách
const addReview = async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.reviews.push({
      rating,
      comment,
      user_id: userId,
    });

    await book.save();

    res.status(200).json({ message: "Review added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Phương thức cập nhật review của sách
const editReview = async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    const review = book.reviews.find(
      (r) => r.user_id.toString() === userId.toString()
    );

    if (!review) {
      console.log("Review not found for user:", userId);
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;

    await book.save();

    res.status(200).json({ message: "Review updated successfully", book });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Phương thức xóa review của sách
const deleteReview = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    const reviewIndex = book.reviews.findIndex(
      (r) => r.user_id.toString() === userId.toString()
    );

    if (reviewIndex === -1) {
      console.log("Review not found for user:", userId);
      return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review from the reviews array
    book.reviews.splice(reviewIndex, 1);

    await book.save();

    res.status(200).json({ message: "Review deleted successfully", book });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const BookController = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookById,
  addReview,
  editReview,
  deleteReview,
};

export default BookController;
