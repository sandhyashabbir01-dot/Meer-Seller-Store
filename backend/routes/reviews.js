const express = require("express");

const Review = require("../models/Review");
const { protect, adminOnly } = require("../middleware/auth");
const { notify, notifyAdmins } = require("../utils/notify");

const router = express.Router();

// PUBLIC: approved reviews
router.get("/product/:productKey", async (req, res) => {
  try {
    const reviews = await Review.find({
      productKey: req.params.productKey,
      status: "approved",
    }).sort({ createdAt: -1 });

    const count = reviews.length;
    const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    res.status(200).json({ count, average: Number(average.toFixed(1)), reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

// CUSTOMER: apna review (kisi bhi status mein)
router.get("/mine/:productKey", protect, async (req, res) => {
  try {
    const review = await Review.findOne({
      productKey: req.params.productKey,
      customerEmail: req.user.email.toLowerCase(),
    });
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your review." });
  }
});

// CUSTOMER: review submit (admin approval ke baad dikhega)
router.post("/", protect, async (req, res) => {
  try {
    const { productKey, productName, rating, comment } = req.body;
    const stars = Number(rating);

    if (!productKey) {
      return res.status(400).json({ message: "Product is required." });
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: "Please write a short comment." });
    }

    const email = req.user.email.toLowerCase();

    const existing = await Review.findOne({ productKey: String(productKey), customerEmail: email });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    const review = await Review.create({
      productKey: String(productKey),
      productName: productName || "",
      customerName: req.user.name,
      customerEmail: email,
      rating: stars,
      comment: comment.trim(),
      status: "pending",
    });

    await notifyAdmins({
      type: "new_review",
      title: "New review waiting for approval",
      message: `${req.user.name} gave ${stars}/5 to "${productName || productKey}".`,
    });

    res.status(201).json({
      message: "Thank you! Your review has been submitted and will appear after admin approval.",
      review,
    });
  } catch (error) {
    console.log("Create Review Error:", error.message);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

// ADMIN: saare reviews
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    res.status(200).json(await Review.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

// ADMIN: approve / reject
router.put("/admin/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (status !== "pending") {
      const name = review.productName || review.productKey;

      await notify({
        recipientType: "customer",
        recipientKey: review.customerEmail,
        type: "review_status",
        title: status === "approved" ? "Your review was approved" : "Your review was not approved",
        message:
          status === "approved"
            ? `Your review for "${name}" is now visible on the website.`
            : `Your review for "${name}" was not approved.`,
      });
    }

    res.status(200).json({ message: `Review ${status}.`, review });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review." });
  }
});

// ADMIN: delete
router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review." });
  }
});

module.exports = router;