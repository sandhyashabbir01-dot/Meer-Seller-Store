import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import AdminReviews from "./AdminReviews";
const API = "http://localhost:5000";

function Admin() {
  // ===== ADMIN LOGIN GATE =====
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("meerAdminToken") || ""
  );
  const [adminUser, setAdminUser] = useState(
    JSON.parse(localStorage.getItem("meerAdminUser") || "null")
  );
  const [loginError, setLoginError] = useState("");

  // ===== REGISTRATION TOGGLE =====
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // ===== ORDERS =====
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== SELLER MANAGEMENT =====
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);

  // ===== ADMIN PRODUCT MANAGEMENT =====
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminProductsLoading, setAdminProductsLoading] = useState(false);
  const [showAdminProductForm, setShowAdminProductForm] = useState(false);
  const [editingAdminProduct, setEditingAdminProduct] = useState(null);

  const [adminProductName, setAdminProductName] = useState("");
  const [adminProductPrice, setAdminProductPrice] = useState("");
  const [adminProductQuantity, setAdminProductQuantity] = useState("");
  const [adminProductCollection, setAdminProductCollection] =
    useState("MEER Collection");
  const [adminProductCategory, setAdminProductCategory] = useState("");
  const [adminProductSubCategory, setAdminProductSubCategory] = useState("");
  const [adminProductDescription, setAdminProductDescription] = useState("");
  const [adminProductImage, setAdminProductImage] = useState("");
  const [adminProductError, setAdminProductError] = useState("");
  const [adminProductSaving, setAdminProductSaving] = useState(false);

  // =========================================================
  // ADMIN LOGIN / LOGOUT
  // =========================================================
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Login failed.");
        return;
      }

      if (!data.user.isAdmin) {
        setLoginError("This account does not have admin access.");
        return;
      }

      localStorage.setItem("meerAdminToken", data.token);
      localStorage.setItem("meerAdminUser", JSON.stringify(data.user));
      setAdminToken(data.token);
      setAdminUser(data.user);
    } catch (error) {
      setLoginError("Could not connect to the server.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("meerAdminToken");
    localStorage.removeItem("meerAdminUser");
    setAdminToken("");
    setAdminUser(null);
  };

  // =========================================================
  // SETTINGS
  // =========================================================
  useEffect(() => {
    if (!adminToken) return;

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API}/api/settings`);
        const data = await response.json();
        setRegistrationEnabled(data.registrationEnabled);
      } catch (error) {
        console.error("Fetch Settings Error:", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [adminToken]);

  const handleToggleRegistration = async () => {
    const newValue = !registrationEnabled;

    try {
      const response = await fetch(`${API}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ registrationEnabled: newValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update setting.");
        return;
      }

      setRegistrationEnabled(newValue);
    } catch (error) {
      alert("Could not connect to the server.");
    }
  };

  // =========================================================
  // ORDERS
  // =========================================================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Order status could not be updated.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order.");
      }

      setOrders((currentOrders) =>
        currentOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Delete Order Error:", error);
      alert("Order could not be deleted.");
    }
  };

  useEffect(() => {
    if (!adminToken) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/api/orders`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminToken]);

  // =========================================================
  // SELLERS
  // =========================================================
  const updateSellerStatus = async (sellerId, status, successMessage) => {
    try {
      const response = await fetch(`${API}/api/sellers/${sellerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update seller.");
      }

      setSellers((currentSellers) =>
        currentSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, status } : seller
        )
      );

      alert(successMessage);
    } catch (error) {
      console.error("Update Seller Error:", error);
      alert("Seller could not be updated.");
    }
  };

  const handleApproveSeller = (sellerId) =>
    updateSellerStatus(sellerId, "approved", "Seller approved successfully!");

  const handleRejectSeller = (sellerId) =>
    updateSellerStatus(sellerId, "rejected", "Seller rejected.");

  const handleDeleteSeller = async (sellerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this seller?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/api/sellers/${sellerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete seller.");
      }

      setSellers((currentSellers) =>
        currentSellers.filter((seller) => seller._id !== sellerId)
      );

      alert("Seller deleted successfully!");
    } catch (error) {
      console.error("Delete Seller Error:", error);
      alert("Seller could not be deleted.");
    }
  };

  useEffect(() => {
    if (!adminToken) return;

    const fetchSellers = async () => {
      try {
        const response = await fetch(`${API}/api/sellers`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sellers.");
        }

        const data = await response.json();
        setSellers(data);
      } catch (error) {
        console.error("Fetch Sellers Error:", error);
      } finally {
        setSellersLoading(false);
      }
    };

    fetchSellers();
  }, [adminToken]);

  // =========================================================
  // ADMIN PRODUCTS (ADD / EDIT / DELETE / PRICE)
  // =========================================================
  const resetAdminProductForm = () => {
    setEditingAdminProduct(null);
    setAdminProductName("");
    setAdminProductPrice("");
    setAdminProductQuantity("");
    setAdminProductCollection("MEER Collection");
    setAdminProductCategory("");
    setAdminProductSubCategory("");
    setAdminProductDescription("");
    setAdminProductImage("");
    setAdminProductError("");
  };

  const fetchAdminProducts = async () => {
    if (!adminToken) return;

    setAdminProductsLoading(true);

    try {
      const response = await fetch(`${API}/api/admin/products`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      setAdminProducts(data);
    } catch (error) {
      console.error("Admin Products Error:", error);
      alert(error.message || "Could not load products.");
    } finally {
      setAdminProductsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  const handleAdminProductImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAdminProductError("Please select a valid image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAdminProductImage(reader.result);
      setAdminProductError("");
    };

    reader.readAsDataURL(file);
  };

  const handleAdminProductSave = async (e) => {
    e.preventDefault();

    setAdminProductError("");

    if (!adminProductName.trim()) {
      setAdminProductError("Product name is required.");
      return;
    }

    if (adminProductPrice === "" || Number(adminProductPrice) < 0) {
      setAdminProductError("Please enter a valid price.");
      return;
    }

    if (
      adminProductQuantity === "" ||
      !Number.isInteger(Number(adminProductQuantity)) ||
      Number(adminProductQuantity) < 0
    ) {
      setAdminProductError("Please enter a valid quantity.");
      return;
    }

    setAdminProductSaving(true);

    try {
      const payload = {
        name: adminProductName.trim(),
        price: Number(adminProductPrice),
        quantity: Number(adminProductQuantity),
        collection: adminProductCollection,
        category: adminProductCategory.trim() || "General",
        subCategory: adminProductSubCategory.trim(),
        description: adminProductDescription.trim(),
        image: adminProductImage,
      };

      const url = editingAdminProduct
        ? `${API}/api/admin/products/${editingAdminProduct._id}`
        : `${API}/api/admin/products`;

      const method = editingAdminProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save product.");
      }

      alert(
        editingAdminProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetAdminProductForm();
      setShowAdminProductForm(false);
      await fetchAdminProducts();
    } catch (error) {
      console.error("Admin Product Save Error:", error);
      setAdminProductError(error.message || "Could not save product.");
    } finally {
      setAdminProductSaving(false);
    }
  };

  const handleEditAdminProduct = (product) => {
    setEditingAdminProduct(product);
    setAdminProductName(product.name || "");
    setAdminProductPrice(product.price ?? "");
    setAdminProductQuantity(product.quantity ?? "");
    setAdminProductCollection(product.collection || "MEER Collection");
    setAdminProductCategory(product.category || "");
    setAdminProductSubCategory(product.subCategory || "");
    setAdminProductDescription(product.description || "");
    setAdminProductImage(product.image || "");
    setAdminProductError("");
    setShowAdminProductForm(true);
  };

  const handleDeleteAdminProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setAdminProducts((current) =>
        current.filter((product) => product._id !== productId)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete Admin Product Error:", error);
      alert(error.message || "Could not delete product.");
    }
  };

  // =========================================================
  // LOGIN SCREEN
  // =========================================================
  if (!adminToken || !adminUser?.isAdmin) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-logo">
            <span>MEER</span>
            <small>LUXURY COLLECTION</small>
          </div>

          <h2>Admin Login</h2>
          <p>Please log in with your admin account to continue.</p>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />

            {loginError && <p className="admin-login-error">{loginError}</p>}

            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================
  return (
    <div className="admin-page">
      {/* ===== ADMIN HEADER ===== */}
      <header className="admin-header">
        <div className="admin-logo">
          <span>MEER</span>
          <small>LUXURY COLLECTION</small>
        </div>

        <div className="admin-title">ADMIN DASHBOARD</div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleAdminLogout}
        >
          Logout ({adminUser?.name})
        </button>
      </header>

      {/* ===== ADMIN CONTENT ===== */}
      <main className="admin-content">
        {/* ===== PAGE HEADING ===== */}
        <div className="admin-page-heading">
          <h1>Dashboard</h1>
          <p>Manage your Meer Luxury Collection store.</p>
        </div>

        {/* ===== STORE SETTINGS ===== */}
        <section className="admin-settings-section">
          <h2>Store Settings</h2>

          <div className="admin-setting-row">
            <div>
              <strong>Customer Registration</strong>
              <p>
                {registrationEnabled
                  ? "New customers can currently create an account."
                  : "New customer registrations are currently disabled."}
              </p>
            </div>

            <button
              type="button"
              className={`toggle-switch ${registrationEnabled ? "on" : "off"}`}
              onClick={handleToggleRegistration}
              disabled={settingsLoading}
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
        </section>

        {/* ===== DASHBOARD STATS ===== */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending Orders</span>
            <strong>
              {orders.filter((order) => order.status === "Pending").length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Processing Orders</span>
            <strong>
              {orders.filter((order) => order.status === "Processing").length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Shipped Orders</span>
            <strong>
              {orders.filter((order) => order.status === "Shipped").length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Completed Orders</span>
            <strong>
              {orders.filter((order) => order.status === "Completed").length}
            </strong>
          </div>
        </section>

        {/* ===== SELLER MANAGEMENT SECTION ===== */}
        <section className="admin-orders-section">
          <div className="admin-section-header">
            <h2>Seller Management</h2>
            <span>
              {sellers.length} Seller{sellers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {sellersLoading ? (
            <div className="admin-empty">
              <h3>Loading Sellers...</h3>
              <p>Please wait while we fetch seller applications.</p>
            </div>
          ) : sellers.length === 0 ? (
            <div className="admin-empty">
              <h3>No Sellers Yet</h3>
              <p>No seller applications have been submitted yet.</p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {sellers.map((seller) => (
                <div className="admin-order-card" key={seller._id}>
                  <div className="admin-order-top">
                    <div>
                      <h3>{seller.shopName}</h3>
                      <p>
                        Applied: {new Date(seller.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className={`seller-status ${seller.status}`}>
                      {seller.status}
                    </span>
                  </div>

                  <div className="admin-customer-info">
                    <h4>Seller Details</h4>

                    <div className="customer-details-grid">
                      <p>
                        <strong>Name:</strong> {seller.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {seller.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {seller.phone}
                      </p>
                      <p>
                        <strong>Shop:</strong> {seller.shopName}
                      </p>
                    </div>
                  </div>

                  <div className="seller-actions">
                    {seller.status === "pending" && (
                      <>
                        <button
                          type="button"
                          className="seller-approve-button"
                          onClick={() => handleApproveSeller(seller._id)}
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="seller-reject-button"
                          onClick={() => handleRejectSeller(seller._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="delete-order-button"
                      onClick={() => handleDeleteSeller(seller._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== ADMIN PRODUCT MANAGEMENT ===== */}
        <section className="admin-orders-section">
          <div className="admin-section-header">
            <h2>MEER Product Management</h2>

            <div className="admin-products-header-actions">
              <span>
                {adminProducts.length} Product
                {adminProducts.length !== 1 ? "s" : ""}
              </span>

              <button
                type="button"
                className="admin-add-product-button"
                onClick={() => {
                  resetAdminProductForm();
                  setShowAdminProductForm(true);
                }}
              >
                + Add Product
              </button>
            </div>
          </div>

          {adminProductsLoading ? (
            <div className="admin-empty">
              <h3>Loading Products...</h3>
              <p>Please wait while we fetch MEER products.</p>
            </div>
          ) : adminProducts.length === 0 ? (
            <div className="admin-empty">
              <h3>No Admin Products Yet</h3>
              <p>Add products for your MEER collections.</p>

              <button
                type="button"
                className="admin-add-product-button"
                onClick={() => {
                  resetAdminProductForm();
                  setShowAdminProductForm(true);
                }}
              >
                + Add First Product
              </button>
            </div>
          ) : (
            <div className="admin-orders-list">
              {adminProducts.map((product) => (
                <div
                  className="admin-order-card admin-product-card"
                  key={product._id}
                >
                  <div className="admin-product-card-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="admin-order-top">
                    <div>
                      <h3>{product.name}</h3>
                      <p>Collection: {product.collection}</p>
                      <p>Category: {product.category}</p>

                      {product.subCategory && (
                        <p>Subcategory: {product.subCategory}</p>
                      )}
                    </div>

                    <span className="seller-status approved">
                      ADMIN PRODUCT
                    </span>
                  </div>

                  <div className="admin-customer-info">
                    <h4>Product Details</h4>

                    <div className="customer-details-grid">
                      <p>
                        <strong>Price:</strong> $
                        {Number(product.price).toFixed(2)}
                      </p>

                      <p>
                        <strong>Remaining:</strong> {product.quantity}
                      </p>

                      <p>
                        <strong>Sold:</strong> {product.sold || 0}
                      </p>

                      <p>
                        <strong>Total Stock:</strong>{" "}
                        {Number(product.quantity || 0) +
                          Number(product.sold || 0)}
                      </p>
                    </div>

                    <p className="admin-product-description">
                      {product.description || "No description added."}
                    </p>
                  </div>

                  <div className="seller-actions">
                    <button
                      type="button"
                      className="seller-approve-button"
                      onClick={() => handleEditAdminProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-order-button"
                      onClick={() => handleDeleteAdminProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== ORDERS SECTION ===== */}
        <section className="admin-orders-section">
          <div className="admin-section-header">
            <h2>Recent Orders</h2>
            <span>Order Management</span>
          </div>

          {loading ? (
            <div className="admin-empty">
              <h3>Loading Orders...</h3>
              <p>Please wait while we fetch customer orders.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">
              <h3>No Orders Yet</h3>
              <p>No customer orders have been placed yet.</p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <div className="admin-order-card" key={order._id}>
                  {/* ORDER HEADER */}
                  <div className="admin-order-top">
                    <div>
                      <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p>{new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <select
                      className="order-status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      type="button"
                      className="delete-order-button"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </div>

                  {/* PRODUCTS */}
                  <div className="admin-order-products">
                    <h4>Ordered Products</h4>

                    {order.products.map((product, index) => (
                      <div
                        className="admin-product-row"
                        key={`${order._id}-${index}`}
                      >
                        <img src={product.image} alt={product.name} />

                        <div className="admin-product-info">
                          <strong>{product.name}</strong>
                          <p>Quantity: {product.quantity}</p>
                        </div>

                        <span className="admin-product-price">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CUSTOMER */}
                  <div className="admin-customer-info">
                    <h4>Customer Details</h4>

                    <div className="customer-details-grid">
                      <p>
                        <strong>Name:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customerEmail}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.customerPhone}
                      </p>
                      <p>
                        <strong>City:</strong> {order.customerCity}
                      </p>
                      <p className="customer-address">
                        <strong>Address:</strong> {order.customerAddress}
                      </p>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="admin-order-total">
                    <span>Total Amount</span>
                    <strong>${Number(order.totalAmount).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AdminReviews token={adminToken} />
      </main>

      {/* ===== ADMIN ADD / EDIT PRODUCT MODAL ===== */}
      {showAdminProductForm && (
        <div
          className="admin-product-modal-overlay"
          onClick={() => setShowAdminProductForm(false)}
        >
          <div
            className="admin-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-product-modal-header">
              <div>
                <span>MEER LUXURY COLLECTION</span>
                <h2>
                  {editingAdminProduct ? "Edit Product" : "Add New Product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminProductForm(false)}
              >
                ×
              </button>
            </div>

            <form
              className="admin-product-form"
              onSubmit={handleAdminProductSave}
            >
              <div className="admin-product-image-section">
                <div className="admin-product-preview">
                  {adminProductImage ? (
                    <img src={adminProductImage} alt="Product Preview" />
                  ) : (
                    <span>Product Image</span>
                  )}
                </div>

                <label className="admin-image-upload">
                  Choose Product Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAdminProductImage}
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Product Name"
                value={adminProductName}
                onChange={(e) => setAdminProductName(e.target.value)}
                required
              />

              <div className="admin-product-form-row">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={adminProductPrice}
                  onChange={(e) => setAdminProductPrice(e.target.value)}
                  required
                />

                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Remaining Quantity"
                  value={adminProductQuantity}
                  onChange={(e) => setAdminProductQuantity(e.target.value)}
                  required
                />
              </div>

              <select
                value={adminProductCollection}
                onChange={(e) => setAdminProductCollection(e.target.value)}
              >
                <option>MEER Collection</option>
                <option>Fashion</option>
                <option>Jewellery</option>
                <option>Bags & Accessories</option>
                <option>India Collection</option>
                <option>UK Collection</option>
              </select>

              <input
                type="text"
                placeholder="Category"
                value={adminProductCategory}
                onChange={(e) => setAdminProductCategory(e.target.value)}
              />

              <input
                type="text"
                placeholder="Subcategory (optional)"
                value={adminProductSubCategory}
                onChange={(e) => setAdminProductSubCategory(e.target.value)}
              />

              <textarea
                placeholder="Product Description"
                rows="4"
                value={adminProductDescription}
                onChange={(e) => setAdminProductDescription(e.target.value)}
              />

              {adminProductError && (
                <p className="auth-error">{adminProductError}</p>
              )}

              <button
                type="submit"
                className="admin-product-save-button"
                disabled={adminProductSaving}
              >
                {adminProductSaving
                  ? "Saving..."
                  : editingAdminProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;