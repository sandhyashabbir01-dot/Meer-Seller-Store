const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");
const Seller = require("../models/Seller");
const Notification = require("../models/notification");

const router = express.Router();

// Token se pata lagata hai: admin / seller / customer
const identify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);

    if (decoded.role === "seller") {
      const seller = await Seller.findById(decoded.id);
      if (!seller) return res.status(401).json({ message: "Seller not found." });
      req.notif = { role: "seller", key: String(seller._id) };
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found." });
      req.notif = user.isAdmin
        ? { role: "admin", key: "admin" }
        : { role: "customer", key: user.email.toLowerCase() };
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token." });
  }
};

router.use(identify);

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientKey: req.notif.key })
      .sort({ createdAt: -1 })
      .limit(50);

    const unread = await Notification.countDocuments({
      recipientKey: req.notif.key,
      isRead: false,
    });

    res.status(200).json({ role: req.notif.role, unread, notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
});

router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientKey: req.notif.key, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notifications." });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientKey: req.notif.key },
      { isRead: true }
    );
    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification." });
  }
});

module.exports = router;