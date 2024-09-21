import Event from "../models/eventModel.js";
import asyncHandler from "./../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { extractPublicId } from "cloudinary-build-url";
import { v2 as cloudinary } from "cloudinary";

// Tạo sự kiện mới
const createEvent = asyncHandler(async (req, res) => {
  const { title, startDate, endDate, color, products, url } = req.body;
  console.log(url);
  const public_id = extractPublicId(url);
  const event = new Event({
    title,
    startDate,
    endDate,
    images: {
      public_id: public_id,
      url: url,
    },
    color,
    products: products.map((product) => ({
      ...product,
      maxTotalQuantity: product.maxTotalQuantity || 0,
      soldQuantity: 0,
    })),
  });

  await event.save();

  for (const product of products) {
    const { product: productId, variants } = product;
    for (const variant of variants) {
      const productData = await Product.findById(productId);
      const originalPrice = productData.variants.id(variant._id).price;

      let finalPrice;
      if (variant.discountType === "percentage") {
        finalPrice =
          originalPrice - (originalPrice * variant.discountValue) / 100;
        finalPrice = Math.round(finalPrice);
      } else if (variant.discountType === "price") {
        finalPrice = originalPrice - variant.discountValue;
      }

      await Product.updateOne(
        { _id: productId, "variants._id": variant._id },
        { $set: { "variants.$.discountPrice": finalPrice } }
      );

      variant.finalPrice = finalPrice;
    }
  }

  await event.save();

  res.status(201).json(event);
});

// Cập nhật sự kiện
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, color, products = [], url } = req.body;
  const existingEvent = await Event.findById(id);

  if (!existingEvent) {
    res.status(404);
    throw new Error("Không tìm thấy sự kiện");
  }

  // Xóa ảnh cũ nếu URL mới khác với URL cũ
  if (existingEvent.images.url !== url) {
    const oldPublicId = extractPublicId(existingEvent.images.url);
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log("Đã xóa ảnh cũ thành công");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh cũ:", error);
      }
    }
  }

  const public_id = extractPublicId(url);
  const updatedProducts = existingEvent.products.map((existingProduct) => {
    const updatedProduct = products.find(
      (product) =>
        product.product.toString() === existingProduct.product.toString()
    );

    if (updatedProduct) {
      return {
        ...existingProduct._doc,
        ...updatedProduct,
        maxTotalQuantity:
          updatedProduct.maxTotalQuantity !== undefined
            ? updatedProduct.maxTotalQuantity
            : existingProduct.maxTotalQuantity,
        soldQuantity: existingProduct.soldQuantity,
      };
    } else {
      // Nếu sản phẩm không có trong danh sách cập nhật, giữ nguyên
      return existingProduct;
    }
  });

  // Thêm các sản phẩm mới vào danh sách sản phẩm
  products.forEach((product) => {
    const existingProduct = updatedProducts.find(
      (p) => p.product.toString() === product.product.toString()
    );
    if (!existingProduct) {
      updatedProducts.push({
        ...product,
        maxTotalQuantity: product.maxTotalQuantity || 0,
        soldQuantity: 0,
      });
    }
  });

  // Xóa các sản phẩm không còn trong danh sách cập nhật
  const finalUpdatedProducts = updatedProducts.filter((updatedProduct) =>
    products.some(
      (product) =>
        product.product.toString() === updatedProduct.product.toString()
    )
  );

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      title,
      startDate,
      endDate,
      images: {
        public_id: public_id,
        url: url,
      },
      color,
      products: finalUpdatedProducts,
    },
    { new: true }
  );

  if (!updatedEvent) {
    res.status(404);
    throw new Error("Không tìm thấy sự kiện");
  }

  for (const product of products) {
    const { product: productId, variants } = product;
    for (const variant of variants) {
      const productData = await Product.findById(productId);
      const originalPrice = productData.variants.id(variant._id).price;

      let finalPrice;
      if (variant.discountType === "percentage") {
        finalPrice =
          originalPrice - (originalPrice * variant.discountValue) / 100;
      } else if (variant.discountType === "price") {
        finalPrice = originalPrice - variant.discountValue;
      }

      await Product.updateOne(
        { _id: productId, "variants._id": variant._id },
        { $set: { "variants.$.discountPrice": finalPrice } }
      );

      variant.finalPrice = finalPrice;
    }
  }

  await updatedEvent.save();

  res.status(200).json(updatedEvent);
});

// Lấy tất cả sự kiện
const getEvent = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  res.status(200).json(events);
});

// Lấy sự kiện theo ID
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    res.status(404);
    throw new Error("Không tìm thấy sự kiện");
  }

  res.status(200).json(event);
});

// Xóa sự kiện
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  console.log(id);
  if (!event) {
    res.status(404);
    throw new Error("Không tìm thấy sự kiện");
  }
  for (const product of event.products) {
    const { product: productId, variants } = product;
    for (const variant of variants) {
      const productData = await Product.findById(productId);
      const originalPrice = productData.variants.id(variant._id).price;
      await Product.updateOne(
        { _id: productId, "variants._id": variant._id },
        { $set: { "variants.$.discountPrice": originalPrice } }
      );
    }
    console.log("productId", productId);
    console.log("variants:", variants);
  }
  res.status(200).json({ message: "Đã xóa sự kiện" });
});

// Lấy thông tin sản phẩm trong sự kiện
const getEventProductInfo = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const currentDate = new Date();

  const event = await Event.findOne({
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
    "products.product": productId,
  });

  if (!event) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy sản phẩm trong sự kiện hiện tại" });
  }

  const eventProduct = event.products.find(
    (p) => p.product.toString() === productId
  );

  res.json(eventProduct);
});

export {
  createEvent,
  updateEvent,
  getEvent,
  getEventById,
  deleteEvent,
  getEventProductInfo,
};
