import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      enum: ["A", "B", "C"],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: true,
    },
    feature: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("store", productSchema);
