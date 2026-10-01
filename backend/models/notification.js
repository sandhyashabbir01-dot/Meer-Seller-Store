const mongoose = require("mongoose");

// recipientKey: admin -> "admin" | seller -> seller _id | customer -> email (lowercase)
const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ["admin", "seller", "customer"], required: true },
    recipientKey: { type: String, required: true, index: true },
    type: { type: String, default: "info" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    orderId: { type: mongoose.Schema.Types.ObjectId, default: null },
    refId: { type: String, default: "" },
    actionTaken: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);