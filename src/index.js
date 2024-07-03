import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import UserRouter from "./routes/users.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

const PORT = process.env.PORT || 3001;

const app = express();

// DB connect
mongoose
  .connect("mongodb://localhost/book_store")
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(`Err from connect db`));

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 6000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// My Route
app.use("/users", UserRouter);

app.listen(PORT, () => {
  console.log(`App is running at Port: ${PORT}`);
});
