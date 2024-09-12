import Event from "../models/eventModel.js";
import asyncHandler from "./../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { extractPublicId } from "cloudinary-build-url";
// Create a new event
// ... existing code ...
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
    products,
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

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, color, products = [], url } = req.body;

  const public_id = extractPublicId(url);
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
      products,
    },
    { new: true }
  );

  if (!updatedEvent) {
    res.status(404);
    throw new Error("Event not found");
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

const getEvent = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  res.status(200).json(events);
});

// Get event by ID
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.status(200).json(event);
});

// Delete an event
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);
  console.log(id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
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
  res.status(200).json({ message: "Event removed" });
});

export { createEvent, updateEvent, getEvent, getEventById, deleteEvent };
