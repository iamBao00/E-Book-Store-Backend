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

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(400).send({ msg: "Book Id not found" });

    // Lấy tên loại
    const category = await Category.findById(book.category_id);

    if (category) {
      // Sao chép đối tượng book và thêm thuộc tính category_name
      const bookWithCategoryName = {
        ...book._doc, // ._doc để lấy dữ liệu thô của book
        category_name: category.name,
      };
      res.status(200).send(bookWithCategoryName);
    } else {
      res.status(200).send(book);
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// // Phương thức thêm review cho sách
// const addReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, comment, user_id } = req.body;

//     const review = {
//       rating,
//       comment,
//       user_id,
//     };

//     await Book.findByIdAndUpdate(
//       id,
//       { $push: { reviews: review } },
//       { new: true }
//     );

//     res.status(201).send("Review added successfully");
//   } catch (error) {
//     res.status(500).send({ msg: error.message });
//   }
// };

// // Phương thức cập nhật review của sách
// const updateReview = async (req, res) => {
//   try {
//     const { bookId, reviewId } = req.params;
//     const { rating, comment } = req.body;

//     const updatedBook = await Book.findOneAndUpdate(
//       { _id: bookId, "reviews._id": reviewId },
//       {
//         $set: {
//           "reviews.$.rating": rating,
//           "reviews.$.comment": comment,
//           "reviews.$.review_date": Date.now(), // Cập nhật ngày khi cập nhật review
//         },
//       },
//       { new: true }
//     );

//     if (!updatedBook) {
//       return res.status(404).send({ msg: "Review not found" });
//     }

//     res.status(200).send("Review updated successfully");
//   } catch (error) {
//     res.status(500).send({ msg: error.message });
//   }
// };

// // Phương thức xóa review của sách
// const deleteReview = async (req, res) => {
//   try {
//     const { bookId, reviewId } = req.params;

//     const updatedBook = await Book.findByIdAndUpdate(
//       bookId,
//       { $pull: { reviews: { _id: reviewId } } },
//       { new: true }
//     );

//     if (!updatedBook) {
//       return res.status(404).send({ msg: "Review not found" });
//     }

//     res.status(200).send("Review deleted successfully");
//   } catch (error) {
//     res.status(500).send({ msg: error.message });
//   }
// };

const BookController = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookById,
  //   addReview,
  //   updateReview,
  //   deleteReview,
};

export default BookController;
