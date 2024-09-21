import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, image } = req.body;
    const public_id = extractPublicId(image);
    console.log(public_id);
    if (!name) {
      return res.json({ error: "Tên thể loại không đƯợc để trống" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Thể loại đã tồn tại" });
    }

    const category = await new Category({
      name,
      image: {
        public_id: public_id,
        url: image,
      },
    }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, image } = req.body;
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy thể loại này" });
    }

    // Update the category name if provided
    if (name) {
      category.name = name;
    }

    // If a new image is provided, update the image in Cloudinary
    if (image && image !== category.image.url) {
      // Delete the old image from Cloudinary
      if (category.image && category.image.public_id) {
        // console.log("backend:", category.image.public_id);
        try {
          await cloudinary.uploader.destroy(category.image.public_id);
        } catch (error) {
          console.error(`Failed to delete old image: ${error.message}`);
          // Continue without throwing an error, as the image might have already been deleted
        }
      }
      console.log("image", image);
      const publicId = extractPublicId(image);

      category.image = {
        public_id: publicId,

        url: image,
      };
    }

    // Save the updated category to the database
    const updatedCategory = await category.save();

    // Return the updated category as the response
    res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    console.log("category image:", category.image);
    console.log("category imageid:", category.image.public_id);
    // Delete the image from Cloudinary
    if (category.image && category.image.public_id) {
      const result = await cloudinary.uploader.destroy(
        category.image.public_id
      );
      console.log("Cloudinary deletion result:", result); // Log the result
    }

    // Delete the category from the database
    const removed = await Category.findByIdAndDelete(categoryId);

    res.json(removed);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const all = await Category.find({}).limit(limit);
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
