import { useCallback, useEffect, useState } from "react";
import { API } from "./config";

const Stars = ({ value }) => {
  const filled = Math.round(value);
  return (
    <span className="rv-stars">
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
};

export default function ProductReviews({ productKey, productName }) {
  const token = localStorage.getItem("meerUserToken") || "";
  const key = encodeURIComponent(productKey);

  const [summary, setSummary] = useState({ count: 0, average: 0, reviews: [] });
  const [mine, setMine] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/reviews/product/${key}`);
      if (response.ok) setSummary(await response.json());

      if (token) {
        const mineResponse = await fetch(`${API}/api/reviews/mine/${key}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (mineResponse.ok) {
          const data = await mineResponse.json();
          setMine(data.review);
        }
      } else {
        setMine(null);
      }
    } catch {
      // ignore
    }
  }, [key, token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (comment.trim().length < 3) {
      setError("Please write a short comment.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productKey, productName, rating, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not submit your review.");
        return;
      }

      setMessage(data.message);
      setComment("");
      await load();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rv-section">
      <div className="rv-head">
        <h2>Customer Reviews</h2>

        <div className="rv-summary">
          <Stars value={summary.average} />
          <span>
            {summary.count > 0
              ? `${summary.average} / 5 (${summary.count} review${summary.count !== 1 ? "s" : ""})`
              : "No reviews yet"}
          </span>
        </div>
      </div>

      <div className="rv-layout">
        <div className="rv-list">
          {summary.reviews.length === 0 ? (
            <p className="rv-empty">Be the first to review this product.</p>
          ) : (
            summary.reviews.map((review) => (
              <div className="rv-card" key={review._id}>
                <div className="rv-card-top">
                  <strong>{review.customerName}</strong>
                  <Stars value={review.rating} />
                </div>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </div>

        <div className="rv-form-box">
          {!token ? (
            <p className="rv-note">Please login to write a review.</p>
          ) : mine ? (
            <div className="rv-note">
              <strong>Your review</strong>
              <Stars value={mine.rating} />
              <p>{mine.comment}</p>
              <span className={`rv-status ${mine.status}`}>
                {mine.status === "approved"
                  ? "Approved"
                  : mine.status === "rejected"
                  ? "Not approved"
                  : "Waiting for admin approval"}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>Write a review</h3>

              <div className="rv-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={star <= rating ? "on" : ""}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                rows="4"
                maxLength={1000}
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {error && <p className="rv-error">{error}</p>}
              {message && <p className="rv-success">{message}</p>}

              <button type="submit" className="rv-submit" disabled={saving}>
                {saving ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}