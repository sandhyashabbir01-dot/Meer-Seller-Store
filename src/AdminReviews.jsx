import { useCallback, useEffect, useState } from "react";
import { API } from "./config";

export default function AdminReviews({ token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch reviews.");
      setReviews(await response.json());
    } catch (error) {
      console.error("Fetch Reviews Error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      const response = await fetch(`${API}/api/reviews/admin/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setReviews((cur) => cur.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (error) {
      alert(error.message || "Review could not be updated.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`${API}/api/reviews/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setReviews((cur) => cur.filter((r) => r._id !== id));
    } catch (error) {
      alert(error.message || "Review could not be deleted.");
    }
  };

  const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <section className="admin-orders-section">
      <div className="admin-section-header">
        <h2>Customer Reviews</h2>

        <div className="admin-products-header-actions">
          <span>
            {pendingCount} Pending / {reviews.length} Total
          </span>

          <select
            className="order-status-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">
          <h3>Loading Reviews...</h3>
        </div>
      ) : visible.length === 0 ? (
        <div className="admin-empty">
          <h3>No Reviews</h3>
          <p>No reviews found for this filter.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {visible.map((review) => (
            <div className="admin-order-card" key={review._id}>
              <div className="admin-order-top">
                <div>
                  <h3>{review.productName || review.productKey}</h3>
                  <p>{new Date(review.createdAt).toLocaleString()}</p>
                </div>

                <span className={`seller-status ${review.status}`}>{review.status}</span>
              </div>

              <div className="admin-customer-info">
                <h4>
                  {review.customerName} · {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </h4>
                <p className="rv-admin-comment">{review.comment}</p>
                <p className="rv-admin-email">{review.customerEmail}</p>
              </div>

              <div className="seller-actions">
                {review.status !== "approved" && (
                  <button
                    type="button"
                    className="seller-approve-button"
                    onClick={() => setStatus(review._id, "approved")}
                  >
                    Approve
                  </button>
                )}

                {review.status !== "rejected" && (
                  <button
                    type="button"
                    className="seller-reject-button"
                    onClick={() => setStatus(review._id, "rejected")}
                  >
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  className="delete-order-button"
                  onClick={() => remove(review._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}