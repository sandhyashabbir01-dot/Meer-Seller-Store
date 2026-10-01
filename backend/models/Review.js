const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productKey: { type: String, required: true, index: true },
    productName: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);