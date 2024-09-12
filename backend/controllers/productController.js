import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { extractPublicId } from "cloudinary-build-url";
import { v2 as cloudinary } from "cloudinary";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,

      category,
      brand,
    } = req.fields;

    // Process images
    const images = [];
    for (let key in req.fields) {
      if (key.startsWith("images[")) {
        console.log("object", req.fields[key]);
        const url = req.fields[key];
        const color = req.fields[`image[${key.match(/\d+/)[0]}][color]`] || "";

        const public_id = extractPublicId(url);
        images.push({ public_id, url, color });
      }
    }

    // Process specifications
    const specifications = [];
    for (let key in req.fields) {
      if (key.startsWith("specifications[")) {
        const match = key.match(/\d+/);
        if (match) {
          const index = parseInt(match[0], 10);
          const field = key.split("[")[2].split("]")[0]; // 'title', 'specs', or 'key'/'value'

          if (!specifications[index]) {
            specifications[index] = { title: "", details: [] };
          }

          if (field === "title") {
            specifications[index].title = req.fields[key];
          } else if (field === "specs") {
            const specIndex = parseInt(key.split("[")[3].split("]")[0], 10);
            if (!specifications[index].details[specIndex]) {
              specifications[index].details[specIndex] = { key: "", value: "" };
            }
            const specField = key.split("[")[4].split("]")[0]; // 'key' or 'value'
            specifications[index].details[specIndex][specField] =
              req.fields[key];
          }
        }
      }
    }

    // Filter and format specifications
    const formattedSpecifications = specifications.filter(
      (spec) => spec.title && spec.details.length > 0
    );
    // Process variants
    const variants = [];
    for (let key in req.fields) {
      if (key.startsWith("variants[")) {
        const match = key.match(/\d+/);
        if (match) {
          const index = parseInt(match[0], 10);
          const field = key.split("[")[2].split("]")[0]; // 'size', 'color', 'price', etc.

          if (!variants[index]) {
            variants[index] = { size: "", color: "", price: 0 };
          }

          variants[index][field] = req.fields[key];
        }
      }
    }
    // Create and save product
    const product = new Product({
      name,
      description,
      specifications: formattedSpecifications,

      category,
      brand,
      images,
      variants,
    });
    console.log("product", product);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,

      category,
      brand,
    } = req.fields;

    const deleteImages = [];
    for (let key in req.fields) {
      if (key.startsWith("deleteImages[")) {
        deleteImages.push(req.fields[key]);
      }
    }
    console.log(deleteImages);
    if (deleteImages.length > 0) {
      for (const imageUrl of deleteImages) {
        // Assuming you have a utility function extractPublicId to get public_id from the URL
        const publicId = extractPublicId(imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Validation
    if (!name || !brand || !description || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Process images
    const images = [];
    for (let key in req.fields) {
      if (key.startsWith("images[")) {
        const url = req.fields[key];
        const color = req.fields[`image[${key.match(/\d+/)[0]}][color]`] || "";
        const public_id = extractPublicId(url);
        images.push({ public_id, url, color });
      }
    }

    // Process specifications
    const specifications = [];
    for (let key in req.fields) {
      if (key.startsWith("specifications[")) {
        const match = key.match(/\d+/);
        if (match) {
          const index = parseInt(match[0], 10);
          const field = key.split("[")[2].split("]")[0];

          if (!specifications[index]) {
            specifications[index] = { title: "", details: [] };
          }

          if (field === "title") {
            specifications[index].title = req.fields[key];
          } else if (field === "specs") {
            const specIndex = parseInt(key.split("[")[3].split("]")[0], 10);
            if (!specifications[index].details[specIndex]) {
              specifications[index].details[specIndex] = { key: "", value: "" };
            }
            const specField = key.split("[")[4].split("]")[0];
            specifications[index].details[specIndex][specField] =
              req.fields[key];
          }
        }
      }
    }

    // Filter and format specifications
    const formattedSpecifications = specifications.filter(
      (spec) => spec.title && spec.details.length > 0
    );
    // Process variants
    const variants = [];
    for (let key in req.fields) {
      if (key.startsWith("variants[")) {
        const match = key.match(/\d+/);
        if (match) {
          const index = parseInt(match[0], 10);
          const field = key.split("[")[2].split("]")[0];

          if (!variants[index]) {
            variants[index] = {
              color: "",
              storage: "",
              price: 0,
              discountPrice: 0,
              stock: 0,
            };
          }

          variants[index][field] = req.fields[key];
        }
      }
    }
    console.log("object", variants);
    // Update product details
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        brand,
        images,
        specifications: formattedSpecifications,
        variants,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageDeletions = product.images.map(async (image) => {
      if (image && image.public_id) {
        try {
          console.log(
            "Attempting to delete image with public_id:",
            image.public_id
          );
          const result = await cloudinary.uploader.destroy(image.public_id);
          if (result.result === "not found") {
            console.warn(
              `Image with public_id: ${image.public_id} was not found on Cloudinary.`
            );
          } else {
            console.log("Cloudinary deletion result:", result);
          }
        } catch (cloudinaryError) {
          console.error(
            "Error deleting image from Cloudinary:",
            cloudinaryError
          );
        }
      }
    });

    await Promise.all(imageDeletions);

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ message: error.message });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category")
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error();
    res.status(400).json(error.message);
  }
});
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch {
    console.error();
    res.status(400).json(error.message);
  }
});
export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
};
