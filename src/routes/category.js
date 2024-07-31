import express from "express";
import CategoryController from "../controller/categoryController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const CategoryRouter = express.Router();

//AuthMiddleware.ensureAuthenticated, AuthMiddleware.ensureRole("admin"),
// Add thêm 2 middleware này để Authenticate

CategoryRouter.post("/add", CategoryController.createCategory);
CategoryRouter.get("/get-all", CategoryController.getAllCategories);
CategoryRouter.delete("/delete/:id", CategoryController.deleteById);
CategoryRouter.get("/getById/:id", CategoryController.getById);
CategoryRouter.patch("/update/:id", CategoryController.updateCategory);

export default CategoryRouter;
