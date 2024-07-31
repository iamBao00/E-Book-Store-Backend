import { Category } from "../database/Category.js";

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    const isExisted = await Category.findOne({ name });
    console.log(isExisted);
    if (isExisted)
      return res.status(400).send({ msg: "This category name is existed" });
    const category = new Category({ name });
    await category.save();
    res.status(201).send("Category added successfully");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem category có tồn tại không
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ msg: "Category not found" });
    }

    // Nếu tồn tại, thực hiện xóa
    await Category.findByIdAndDelete(id);

    res.status(200).send("Category deleted successfully");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const Cate = await Category.findById(categoryId);
    res.status(200).json(Cate);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const CategoryController = {
  createCategory,
  deleteById,
  getAllCategories,
  getById,
};

export default CategoryController;
