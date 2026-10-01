const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },

    ownerType: {
      type: String,
      enum: ["admin", "seller"],
      default: "seller",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sold: {
      type: Number,
      min: 0,
      default: 0,
    },

    // "collection" reserved naam hai, is liye database mein collectionName
    collectionName: {
      type: String,
      default: "MEER Collection",
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// API response mein wapas "collection" ban kar jayega
productSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.collection = ret.collectionName || "MEER Collection";
    delete ret.collectionName;
    return ret;
  },
});

module.exports = mongoose.model("Product", productSchema);