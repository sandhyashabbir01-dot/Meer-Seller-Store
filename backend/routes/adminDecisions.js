const express = require("express");

const Order = require("../models/Orders");
const Product = require("../models/product");
const Seller = require("../models/Seller");
const Notification = require("../models/notification");
const { protect, adminOnly } = require("../middleware/auth");
const { notify } = require("../utils/notify");

const router = express.Router();

router.use(protect, adminOnly);

// =========================================================
// ORDER: Approve / Reject  (PUT /api/admin/orders/:orderId/decision)
// =========================================================

router.put("/orders/:orderId/decision", async (req, res) => {
  try {
    const { decision } = req.body;

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision." });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if ((order.adminStatus || "Pending") !== "Pending") {
      return res.status(400).json({ message: "You have already decided on this order." });
    }

    order.adminStatus = decision;

    // Reject par stock wapas
    if (decision === "Rejected") {
      for (const item of order.products) {
        if (!item.productId) continue;

        try {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity, sold: -item.quantity },
          });
        } catch (error) {
          console.log("Restore Stock Error:", error.message);
        }
      }
    }

    await order.save();

    await Notification.updateMany(
      { recipientKey: "admin", orderId: order._id, type: "new_order" },
      { actionTaken: decision, isRead: true }
    );

    const shortId = String(order._id).slice(-6).toUpperCase();
    const verb = decision.toLowerCase();

    // Customer ko
    await notify({
      recipientType: "customer",
      recipientKey: order.customerEmail.toLowerCase(),
      type: "order_decision",
      orderId: order._id,
      title: decision === "Approved" ? "Your order was approved" : "Your order was rejected",
      message: `Your order #${shortId} has been ${verb}.`,
    });

    // Related sellers ko (sirf information)
    const sellerIds = [
      ...new Set(order.products.filter((p) => p.sellerId).map((p) => String(p.sellerId))),
    ];

    for (const sellerId of sellerIds) {
      await notify({
        recipientType: "seller",
        recipientKey: sellerId,
        type: "order_decision",
        orderId: order._id,
        title: decision === "Approved" ? "Order approved by admin" : "Order rejected by admin",
        message: `Order #${shortId} has been ${verb} by the admin.`,
      });
    }

    res.status(200).json({ message: `Order ${verb} successfully.`, decision });
  } catch (error) {
    console.log("Admin Order Decision Error:", error.message);
    res.status(500).json({ message: "Failed to save your decision." });
  }
});

// =========================================================
// SELLER APPLICATION: Approve / Reject  (PUT /api/admin/sellers/:id/decision)
// =========================================================

router.put("/sellers/:id/decision", async (req, res) => {
  try {
    const { decision } = req.body;

    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision." });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: decision.toLowerCase() },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    await Notification.updateMany(
      { recipientKey: "admin", type: "new_seller", refId: String(seller._id) },
      { actionTaken: decision, isRead: true }
    );

    await notify({
      recipientType: "seller",
      recipientKey: String(seller._id),
      type: "seller_status",
      title: decision === "Approved" ? "Your seller application was approved" : "Your seller application was rejected",
      message: `Your application for "${seller.shopName}" has been ${decision.toLowerCase()}.`,
    });

    res.status(200).json({ message: `Seller ${decision.toLowerCase()} successfully.`, decision });
  } catch (error) {
    console.log("Admin Seller Decision Error:", error.message);
    res.status(500).json({ message: "Failed to save your decision." });
  }
});

module.exports = router;