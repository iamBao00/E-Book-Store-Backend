import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import UserRouter from "./routes/users.js";
import CategoryRouter from "./routes/category.js";
import BookRouter from "./routes/book.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Cho phép nguồn gốc này
    credentials: true, // Cho phép gửi cookie
  })
);

// DB connect
mongoose
  .connect("mongodb://localhost/book_store")
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(`Err from connect db`));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// My Route
app.use("/users", UserRouter);
app.use("/category", CategoryRouter);
app.use("/book", BookRouter);

//App
app.listen(PORT, () => {
  console.log(`App is running at Port: ${PORT}`);
});
