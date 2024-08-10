import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Book } from "./Book.js"; // Ensure the path is correct
import { Category } from "./Category.js";

// Connect to MongoDB
mongoose.connect("mongodb://localhost/book_store");

// List of unique book image URLs (replace these with your actual URLs)
const bookImgUrls = [
  "https://th.bing.com/th/id/OIP.su1bQjOBMuzCMUYLxrKI6QHaLH?w=198&h=297&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.8LPxqTvPFvkgPax6lRcYPwHaKe?w=198&h=280&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.TPWFnbVgvRvDlfVxVU5kqQHaLG?w=198&h=297&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.00MiR0WFrkZC0nTUIgqySgAAAA?w=197&h=316&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.qDOR-TEowwrF2YoU0KaZoAAAAA?w=197&h=316&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.4zygV7JXARRma1FeXBTxtgHaL0?w=198&h=315&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.MvsnV5XBaC9zcRcborGcywHaLz?w=197&h=315&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.dRb0B_SVL4Bvcwp9TOuFTwHaL0?w=198&h=315&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.rb6aTeGCgJp_H4hAi-DMCwHaL0?w=197&h=315&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.6hN7VjgEcQn73emzurhCxgHaL0?w=197&h=315&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.RHJFIDfFyoq-41lwnYgfTgHaKd?w=198&h=280&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.L6RWyt-D0MQW1XXj4XYE8wHaJ_?w=198&h=267&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.0qxWWiv5uAS-T2OK11jpawHaLZ?w=198&h=305&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.J8NXQTWbyIMlZEKU5O9ZpwAAAA?pid=ImgDet&w=199&h=248&c=7",
  "https://th.bing.com/th/id/OIP.JXOGhW5HFJNFkb5t9d1UKwHaJa?pid=ImgDet&w=199&h=252&c=7",
  "https://th.bing.com/th/id/OIP.LjhzbQNmUyQ8eUYfQ88GngAAAA?pid=ImgDet&w=199&h=248&c=7",
  "https://th.bing.com/th/id/OIP.ljssjapHEWFglRaZMlq2sgHaL0?pid=ImgDet&w=198&h=316&c=7",
  "https://th.bing.com/th/id/OIP.PbkKcaOoOy_aegZGmPIw_wHaLE?w=198&h=296&c=7&r=0&o=5&pid=1.7",
  "https://example.com/image19.jpghttps://th.bing.com/th/id/OIP.X9CYWCIhy6YUsFrHBJs7DwHaKe?w=198&h=280&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.YoSEuuGRa2tV_TwhHpcxkAAAAA?w=197&h=316&c=7&r=0&o=5&pid=1.7",
  "http://ts4.mm.bing.net/th?id=OIP.A8tvGtxL7BQbkSdD_7rgkgHaLS&pid=15.1",
  "https://th.bing.com/th/id/OIP.1xBwjx5JblESESoq0xPvvQHaKW?w=198&h=277&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.CnDo75GNDFuLyYtH0nxu7wAAAA?w=198&h=258&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.p5FiMK7c3OR6Tfv_UkfwzgAAAA?w=127&h=191&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.M1UsWKSm1je9IO7TZdrLQgHaLc?w=115&h=180&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.pe5iMcyQgiYnrbMGtM-zMwHaLv?w=127&h=187&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th?id=OIF.NIszXM1MxHS9i%2bAch1mu0w&w=120&h=195&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIF.eE66HIprPYHA9TyKhB816w?w=130&h=208&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th?id=OIF.Nj3CK15FrJvTu9%2fsEq6UQQ&w=133&h=208&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th?q=Designing+a+Book+Cover&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=moderate&t=1&mw=247",
];

const fetchCategoryIds = async () => {
  try {
    const categories = await Category.find({}, "_id");
    const categoryIds = categories.map((category) => category._id);
    console.log("Category IDs:", categoryIds);
    return categoryIds;
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    throw error; // Ensure this error propagates
  }
};

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const insertFakeData = async () => {
  try {
    // Fetch category IDs
    const categoryIds = await fetchCategoryIds();

    if (categoryIds.length === 0) {
      throw new Error(
        "No categories found. Please add categories before running this script."
      );
    }

    // Number of fake books to insert
    const numberOfBooks = 30;

    if (bookImgUrls.length < numberOfBooks) {
      throw new Error("Not enough unique image URLs provided.");
    }

    // Shuffle the list of image URLs to ensure randomness
    const shuffledBookImgUrls = bookImgUrls.sort(() => 0.5 - Math.random());

    const books = Array.from({ length: numberOfBooks }, (_, index) => {
      const rawTitle = faker.lorem.words(3);
      const title = rawTitle
        .split(" ")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");

      return {
        title: title,
        author: faker.lorem.words(2),
        price: parseFloat(faker.commerce.price({ min: 10, max: 30 })),
        publisher: faker.company.name(),
        description: faker.lorem.paragraph(),
        stock_quantity: faker.number.int({ min: 80, max: 100 }),
        sold: faker.number.int({ min: 0, max: 0 }),
        image: shuffledBookImgUrls[index], // Assign a unique image URL
        category_id:
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
      };
    });

    // Insert fake data into MongoDB
    await Book.insertMany(books);

    console.log("Fake data inserted successfully!");
  } catch (error) {
    console.error("Error inserting fake data:", error);
  } finally {
    // Ensure MongoDB disconnects after operations are completed
    mongoose.disconnect();
  }
};

insertFakeData();
