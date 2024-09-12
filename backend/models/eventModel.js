import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  discountType: {
    type: String,
    required: true,
  },
  discountValue: {
    // Thêm discountValue
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  maxQuantityPerCustomer: {
    type: Number,
    required: false,
  },
  variants: [variantSchema],
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  images: {
    public_id: { type: String },
    url: { type: String, required: true },
  },

  color: {
    type: String,
    required: true,
  },
  products: [productSchema],
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
