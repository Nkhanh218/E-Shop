import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, require: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
const variantSchema = mongoose.Schema({
  color: { type: String, required: true },
  storage: { type: String, required: false }, // e.g., 256GB, 512GB, 1TB
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: false },
  stock: { type: Number, required: true, default: 0 },
});
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [
      {
        public_id: { type: String },
        url: { type: String, required: true },
        color: { type: String, required: false },
        featuredImage: { type: Boolean, required: false, default: false },
      },
    ],
    brand: { type: String, required: true },

    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    variants: [variantSchema],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },

    specifications: [
      {
        title: { type: String, required: true },
        details: [
          {
            key: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
