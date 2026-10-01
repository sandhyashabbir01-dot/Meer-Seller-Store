require("dotenv").config();

console.log("DEBUG - PORT:", process.env.PORT);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user.js");
const Settings = require("./models/Settings");
const Seller = require("./models/Seller");
const Product = require("./models/product");
const Order = require("./models/Orders");
const { notify, notifyAdmins } = require("./utils/notify");
const { protect, adminOnly } = require("./middleware/auth");

const app = express();

// =========================================================
// DATABASE CONNECTION
// =========================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());

app.use(express.json({ limit: "15mb" }));

// =========================================================
// HOME
// =========================================================

app.get("/", (req, res) => {
  res.send("Meer Luxury Collection Backend is Running!");
});

// =========================================================
// CUSTOMER REGISTER
// =========================================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await new Settings().save();
    }

    if (!settings.registrationEnabled) {
      return res.status(403).json({
        message: "New registrations are currently disabled by the admin.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    await notifyAdmins({
      type: "new_customer",
      title: "New customer registered",
      message: `${savedUser.name} (${savedUser.email}) created an account.`,
    });
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.log("Register Error:", error.message);

    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// =========================================================
// CUSTOMER LOGIN
// =========================================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("Login Error:", error.message);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

// =========================================================
// GET SETTINGS
// =========================================================

app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await new Settings().save();
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch settings.",
      error: error.message,
    });
  }
});

// =========================================================
// UPDATE SETTINGS (ADMIN ONLY)
// =========================================================

app.put("/api/settings", protect, adminOnly, async (req, res) => {
  try {
    const { registrationEnabled } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.registrationEnabled = registrationEnabled;

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully!",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update settings.",
      error: error.message,
    });
  }
});

// =========================================================
// SELLER REGISTER
// =========================================================

app.post("/api/sellers/register", async (req, res) => {
  try {
    const { name, shopName, email, phone, password } = req.body;

    if (!name || !shopName || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const existingSeller = await Seller.findOne({
      email: email.toLowerCase(),
    });

    if (existingSeller) {
      return res.status(400).json({
        message: "A seller account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      shopName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      status: "pending",
    });

    await newSeller.save();
    await notifyAdmins({
      type: "new_seller",
      refId: String(newSeller._id),
      title: "New seller application",
      message: `${newSeller.name} applied to sell as "${newSeller.shopName}". Please approve or reject.`,
    });
    res.status(201).json({
      message:
        "Your seller application has been submitted! Please wait for admin approval.",
    });
  } catch (error) {
    console.log("Seller Register Error:", error.message);

    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// =========================================================
// SELLER LOGIN (APPROVED ONLY)
// =========================================================

app.post("/api/sellers/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const seller = await Seller.findOne({ email: email.toLowerCase() });

    if (!seller) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (seller.status === "pending") {
      return res.status(403).json({
        message: "Your seller account is still pending admin approval.",
      });
    }

    if (seller.status === "rejected") {
      return res.status(403).json({
        message: "Your seller application was not approved.",
      });
    }

    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        shopName: seller.shopName,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    console.log("Seller Login Error:", error.message);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

// =========================================================
// CHECK SELLER APPLICATION STATUS
// =========================================================

app.post("/api/sellers/check-status", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const seller = await Seller.findOne({ email: email.toLowerCase() });

    if (!seller) {
      return res.status(404).json({
        message: "No seller application found with this email.",
      });
    }

    res.status(200).json({
      status: seller.status,
      shopName: seller.shopName,
      message:
        seller.status === "pending"
          ? "Your seller application is still pending admin approval."
          : seller.status === "approved"
          ? "Your seller application has been approved!"
          : "Your seller application was rejected.",
    });
  } catch (error) {
    console.log("Check Seller Status Error:", error.message);

    res.status(500).json({
      message: "Could not check seller application status.",
    });
  }
});

// =========================================================
// GET ALL SELLERS (ADMIN ONLY)
// =========================================================

app.get("/api/sellers", protect, adminOnly, async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });

    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sellers.",
      error: error.message,
    });
  }
});

// =========================================================
// SELLER AUTHENTICATION MIDDLEWARE
// =========================================================

const sellerProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Seller authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(403).json({
        message: "Seller access required.",
      });
    }

    const sellerId = decoded.id;

    if (!sellerId) {
      return res.status(401).json({
        message: "Invalid seller token.",
      });
    }

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller account not found.",
      });
    }

    if (seller.status !== "approved") {
      return res.status(403).json({
        message: "Seller account is not approved.",
      });
    }

    req.seller = seller;

    next();
  } catch (error) {
    console.log("Seller Authentication Error:", error.message);

    return res.status(401).json({
      message: "Seller authentication failed.",
    });
  }
};

// =========================================================
// PUBLIC PRODUCTS (ADMIN + APPROVED SELLER PRODUCTS)
// =========================================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $gt: 0 },
    })
      .populate("seller", "name shopName email status")
      .sort({ createdAt: -1 });

    const visibleProducts = products.filter((product) => {
      // ADMIN PRODUCT
      if (product.ownerType === "admin") {
        return true;
      }

      // SELLER PRODUCT
      return product.seller && product.seller.status === "approved";
    });

    res.status(200).json(visibleProducts);
  } catch (error) {
    console.log("Fetch Public Products Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
});

// =========================================================
// GET SELLER PRODUCTS
// =========================================================

app.get("/api/seller/products", sellerProtect, async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.seller._id,
      ownerType: { $ne: "admin" },
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.log("Fetch Seller Products Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch seller products.",
      error: error.message,
    });
  }
});

// =========================================================
// ADD SELLER PRODUCT
// =========================================================

app.post("/api/seller/products", sellerProtect, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      quantity,
      collection,
      category,
      subCategory,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required.",
      });
    }

    const stock = Number(quantity);

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        message: "Quantity must be a valid whole number.",
      });
    }

    const product = await Product.create({
      seller: req.seller._id,

      ownerType: "seller",

      name: name.trim(),

      price: Number(price),

      description: description ? description.trim() : "",

      image: image || "",

      quantity: stock,

      sold: 0,

      collectionName:
        collection && collection.trim() ? collection.trim() : "MEER Collection",

      category: category && category.trim() ? category.trim() : "General",

      subCategory:
        subCategory && subCategory.trim() ? subCategory.trim() : "",
    });

    res.status(201).json({
      message: "Product added successfully!",
      product,
    });
  } catch (error) {
    console.log("Add Seller Product Error:", error.message);

    res.status(500).json({
      message: "Failed to add product.",
      error: error.message,
    });
  }
});

// =========================================================
// UPDATE SELLER PRODUCT
// =========================================================

app.put(
  "/api/seller/products/:productId",
  sellerProtect,
  async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.productId,
        seller: req.seller._id,
        ownerType: { $ne: "admin" },
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      const {
        name,
        price,
        description,
        image,
        quantity,
        collection,
        category,
        subCategory,
      } = req.body;

      const remainingQuantity = Number(quantity);

      if (
        !name ||
        price === undefined ||
        !Number.isInteger(remainingQuantity) ||
        remainingQuantity < 0
      ) {
        return res.status(400).json({
          message: "Please enter valid product details.",
        });
      }

      product.name = name.trim();

      product.price = Number(price);

      product.description = description ? description.trim() : "";

      product.image = image || "";

      product.quantity = remainingQuantity;

      product.collectionName =
        collection && collection.trim()
          ? collection.trim()
          : product.collectionName || "MEER Collection";

      product.category = category && category.trim() ? category.trim() : "General";

      product.subCategory =
        subCategory && subCategory.trim() ? subCategory.trim() : "";

      await product.save();

      res.status(200).json({
        message: "Product updated successfully!",
        product,
      });
    } catch (error) {
      console.log("Update Seller Product Error:", error.message);

      res.status(500).json({
        message: "Failed to update product.",
        error: error.message,
      });
    }
  }
);

// =========================================================
// DELETE SELLER PRODUCT
// =========================================================

app.delete(
  "/api/seller/products/:productId",
  sellerProtect,
  async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.productId,
        seller: req.seller._id,
        ownerType: { $ne: "admin" },
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      res.status(200).json({
        message: "Product deleted successfully!",
      });
    } catch (error) {
      console.log("Delete Seller Product Error:", error.message);

      res.status(500).json({
        message: "Failed to delete product.",
        error: error.message,
      });
    }
  }
);

// =========================================================
// SELLER MY ORDERS
// =========================================================

app.get("/api/seller/orders", sellerProtect, async (req, res) => {
  try {
    const orders = await Order.find({
      "products.sellerId": req.seller._id,
    }).sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const orderData = order.toObject();

      orderData.products = orderData.products.filter(
        (product) =>
          product.sellerId &&
          product.sellerId.toString() === req.seller._id.toString()
      );

      orderData.sellerTotal = orderData.products.reduce(
        (total, product) =>
          total + Number(product.price || 0) * Number(product.quantity || 0),
        0
      );

      return orderData;
    });

    res.status(200).json(sellerOrders);
  } catch (error) {
    console.log("Seller Orders Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch seller orders.",
      error: error.message,
    });
  }
});

// =========================================================
// ADMIN GET ALL ADMIN PRODUCTS
// =========================================================

app.get("/api/admin/products", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({
      ownerType: "admin",
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.log("Admin Products Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch admin products.",
      error: error.message,
    });
  }
});

// =========================================================
// ADMIN ADD PRODUCT
// =========================================================

app.post("/api/admin/products", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      quantity,
      collection,
      category,
      subCategory,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required.",
      });
    }

    const stock = Number(quantity);

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        message: "Quantity must be a valid whole number.",
      });
    }

    const product = await Product.create({
      seller: null,

      ownerType: "admin",

      name: name.trim(),

      price: Number(price),

      description: description ? description.trim() : "",

      image: image || "",

      quantity: stock,

      sold: 0,

      collectionName:
        collection && collection.trim() ? collection.trim() : "MEER Collection",

      category: category && category.trim() ? category.trim() : "General",

      subCategory:
        subCategory && subCategory.trim() ? subCategory.trim() : "",
    });

    res.status(201).json({
      message: "Admin product added successfully!",
      product,
    });
  } catch (error) {
    console.log("Add Admin Product Error:", error.message);

    res.status(500).json({
      message: "Failed to add admin product.",
      error: error.message,
    });
  }
});

// =========================================================
// ADMIN UPDATE PRODUCT (PRICE, QUANTITY, ETC.)
// =========================================================

app.put(
  "/api/admin/products/:productId",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.productId,
        ownerType: "admin",
      });

      if (!product) {
        return res.status(404).json({
          message: "Admin product not found.",
        });
      }

      const {
        name,
        price,
        description,
        image,
        quantity,
        collection,
        category,
        subCategory,
      } = req.body;

      const stock = Number(quantity);

      if (
        !name ||
        price === undefined ||
        !Number.isInteger(stock) ||
        stock < 0
      ) {
        return res.status(400).json({
          message: "Please enter valid product details.",
        });
      }

      product.name = name.trim();

      product.price = Number(price);

      product.description = description ? description.trim() : "";

      product.image = image || "";

      product.quantity = stock;

      product.collectionName =
        collection && collection.trim() ? collection.trim() : "MEER Collection";

      product.category = category && category.trim() ? category.trim() : "General";

      product.subCategory =
        subCategory && subCategory.trim() ? subCategory.trim() : "";

      await product.save();

      res.status(200).json({
        message: "Admin product updated successfully!",
        product,
      });
    } catch (error) {
      console.log("Update Admin Product Error:", error.message);

      res.status(500).json({
        message: "Failed to update admin product.",
        error: error.message,
      });
    }
  }
);

// =========================================================
// ADMIN DELETE PRODUCT
// =========================================================

app.delete(
  "/api/admin/products/:productId",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.productId,
        ownerType: "admin",
      });

      if (!product) {
        return res.status(404).json({
          message: "Admin product not found.",
        });
      }

      res.status(200).json({
        message: "Admin product deleted successfully!",
      });
    } catch (error) {
      console.log("Delete Admin Product Error:", error.message);

      res.status(500).json({
        message: "Failed to delete admin product.",
        error: error.message,
      });
    }
  }
);

// =========================================================
// UPDATE SELLER STATUS (ADMIN ONLY)
// =========================================================

app.put("/api/sellers/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({
        message: "Seller not found.",
      });
    }

    res.status(200).json({
      message: `Seller ${status} successfully!`,
      seller: updatedSeller,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update seller status.",
      error: error.message,
    });
  }
});

// =========================================================
// DELETE SELLER (ADMIN ONLY)
// =========================================================

app.delete("/api/sellers/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);

    if (!deletedSeller) {
      return res.status(404).json({
        message: "Seller not found.",
      });
    }

    // Seller ke products bhi delete kar dein
    await Product.deleteMany({
      seller: deletedSeller._id,
    });

    res.status(200).json({
      message: "Seller and seller products deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete seller.",
      error: error.message,
    });
  }
});

// =========================================================
// CUSTOMER PLACE ORDER + INVENTORY UPDATE
// =========================================================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      products,
      totalAmount,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !customerCity ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "Please complete all order details.",
      });
    }

    const productUpdates = [];

    // ---------------------------------------------------
    // VALIDATE DATABASE PRODUCTS + STOCK
    // ---------------------------------------------------

    for (const item of products) {
      // Hard-coded MEER products ka MongoDB productId nahi hota
      if (!item.productId) {
        continue;
      }

      let product;

      // SELLER PRODUCT
      if (item.sellerId) {
        product = await Product.findOne({
          _id: item.productId,
          seller: item.sellerId,
          ownerType: { $ne: "admin" },
        });
      }

      // ADMIN PRODUCT
      else {
        product = await Product.findOne({
          _id: item.productId,
          ownerType: "admin",
        });
      }

      if (!product) {
        return res.status(404).json({
          message: `Product "${item.name}" is no longer available.`,
        });
      }

      // Seller abhi bhi approved hona chahiye
      if (product.ownerType !== "admin" && product.seller) {
        const seller = await Seller.findById(product.seller);

        if (!seller || seller.status !== "approved") {
          return res.status(403).json({
            message: `Seller product "${product.name}" is no longer available.`,
          });
        }
      }

      const requestedQuantity = Number(item.quantity);

      if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        return res.status(400).json({
          message: "Invalid product quantity.",
        });
      }

      if (product.quantity < requestedQuantity) {
        return res.status(400).json({
          message: `${product.name} has only ${product.quantity} item(s) remaining.`,
        });
      }

      productUpdates.push({
        product,
        quantity: requestedQuantity,
      });
    }

    // ---------------------------------------------------
    // CREATE ORDER
    // ---------------------------------------------------

    const order = new Order({
      customerName,

      customerEmail: customerEmail.toLowerCase(),

      customerPhone,

      customerAddress,

      customerCity,

      products: products.map((item) => ({
        productId: item.productId || null,

        sellerId: item.sellerId || null,

        sellerName: item.sellerName || "",

        shopName: item.shopName || "",

        name: item.name,

        price: Number(item.price),

        image: item.image || "",

        quantity: Number(item.quantity),
      })),

      totalAmount: Number(totalAmount),

      status: "Pending",
    });

    const savedOrder = await order.save();
    const shortId = String(savedOrder._id).slice(-6).toUpperCase();

    // Admin ko (approve / reject ke saath)
    await notifyAdmins({
      type: "new_order",
      orderId: savedOrder._id,
      title: "New order received",
      message: `Order #${shortId} from ${savedOrder.customerName} - $${Number(savedOrder.totalAmount).toFixed(2)}. Please approve or reject.`,
    });

    // Related sellers ko (sirf information)
    const orderSellerIds = [
      ...new Set(
        savedOrder.products
          .filter((p) => p.sellerId)
          .map((p) => String(p.sellerId))
      ),
    ];

    for (const orderSellerId of orderSellerIds) {
      const sellerItems = savedOrder.products.filter(
        (p) => String(p.sellerId) === orderSellerId
      );

      await notify({
        recipientType: "seller",
        recipientKey: orderSellerId,
        type: "new_order",
        orderId: savedOrder._id,
        title: "New order for your products",
        message: `Order #${shortId}: ${sellerItems
          .map((i) => `${i.name} x${i.quantity}`)
          .join(", ")}. Waiting for admin approval.`,
      });
    }

    // Customer ko
    await notify({
      recipientType: "customer",
      recipientKey: savedOrder.customerEmail.toLowerCase(),
      type: "order_placed",
      orderId: savedOrder._id,
      title: "Order received",
      message: `Your order #${shortId} has been received and is waiting for approval.`,
    });

    // ---------------------------------------------------
    // UPDATE INVENTORY
    // ---------------------------------------------------

    for (const update of productUpdates) {
      await Product.findByIdAndUpdate(update.product._id, {
        $inc: {
          quantity: -update.quantity,
          sold: update.quantity,
        },
      });
    }

    res.status(201).json({
      message: "Order submitted successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.log("Order Error:", error.message);

    res.status(500).json({
      message: "Failed to submit order.",
      error: error.message,
    });
  }
});

// =========================================================
// CUSTOMER MY ORDERS
// =========================================================

app.get("/api/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      customerEmail: req.user.email,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("Fetch Customer Orders Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch your orders.",
      error: error.message,
    });
  }
});

// =========================================================
// ADMIN GET ALL ORDERS (ADMIN ONLY)
// =========================================================

app.get("/api/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("Fetch Orders Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
});

// =========================================================
// DELETE ORDER (ADMIN ONLY)
// =========================================================

app.delete("/api/orders/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully!",
      order: deletedOrder,
    });
  } catch (error) {
    console.log("Delete Order Error:", error.message);

    res.status(500).json({
      message: "Failed to delete order.",
      error: error.message,
    });
  }
});

// =========================================================
// UPDATE ORDER STATUS (ADMIN ONLY)
// =========================================================

app.put("/api/orders/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Processing", "Shipped", "Completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    await notify({
      recipientType: "customer",
      recipientKey: updatedOrder.customerEmail.toLowerCase(),
      type: "order_status",
      orderId: updatedOrder._id,
      title: "Order status updated",
      message: `Your order #${String(updatedOrder._id).slice(-6).toUpperCase()} is now ${status}.`,
    });

    res.status(200).json({
      message: "Order status updated successfully!",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Update Order Status Error:", error.message);

    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message,
    });
  }
});

// =========================================================
// EXTRA ROUTES
// =========================================================

app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/adminDecisions"));

// =========================================================
// START SERVER
// =========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});