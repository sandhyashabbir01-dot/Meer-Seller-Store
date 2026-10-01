import { useCallback, useEffect, useState } from "react";
import { API } from "./config";
import { useUiZoom } from "./useUiZoom";

// Admin page par sirf admin, baqi site par customer / seller
const readSessions = () => {
  const sessions = [];

  if (window.location.pathname === "/admin") {
    const adminToken = localStorage.getItem("meerAdminToken");
    if (adminToken) sessions.push({ id: "admin", label: "Admin Notifications", token: adminToken });
    return sessions;
  }

  const userToken = localStorage.getItem("meerUserToken");
  if (userToken) sessions.push({ id: "customer", label: "My Notifications", token: userToken });

  const sellerToken = localStorage.getItem("meerSellerToken");
  if (sellerToken) sessions.push({ id: "seller", label: "Seller Notifications", token: sellerToken });

  return sessions;
};

function Bell({ session }) {
  const { id, label, token } = session;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [busyId, setBusyId] = useState("");

  const authHeader = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      setItems(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
      // server band ho to chup rahein
    }
  }, [token]);

  useEffect(() => {
    load();
    const timer = setInterval(load, 20000);
    return () => clearInterval(timer);
  }, [load]);

  const markRead = async (n) => {
    if (n.isRead) return;

    setItems((cur) => cur.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
    setUnread((c) => Math.max(0, c - 1));

    try {
      await fetch(`${API}/api/notifications/${n._id}/read`, { method: "PUT", headers: authHeader });
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    setItems((cur) => cur.map((x) => ({ ...x, isRead: true })));
    setUnread(0);

    try {
      await fetch(`${API}/api/notifications/read-all`, { method: "PUT", headers: authHeader });
    } catch {
      // ignore
    }
  };

  // Admin: order ya seller application par Approve / Reject
  const decide = async (n, decision) => {
    setBusyId(n._id);

    const url =
      n.type === "new_order"
        ? `${API}/api/admin/orders/${n.orderId}/decision`
        : `${API}/api/admin/sellers/${n.refId}/decision`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ decision }),
      });

      const data = await response.json();
      if (!response.ok) alert(data.message || "Could not save your decision.");

      await load();
    } catch {
      alert("Could not connect to the server.");
    } finally {
      setBusyId("");
    }
  };

  const needsDecision = (n) =>
    id === "admin" &&
    ((n.type === "new_order" && n.orderId) || (n.type === "new_seller" && n.refId));

  return (
    <div className="nc-bell">
      <button
        type="button"
        className="nc-bell-button"
        title={label}
        onClick={() => {
          setOpen((cur) => !cur);
          if (!open) load();
        }}
      >
        🔔
        {unread > 0 && <span className="nc-badge">{unread > 99 ? "99+" : unread}</span>}
      </button>

      {open && (
        <>
          <div className="nc-backdrop" onClick={() => setOpen(false)}></div>

          <div className="nc-panel">
            <div className="nc-panel-header">
              <strong>{label}</strong>
              {unread > 0 && (
                <button type="button" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>

            <div className="nc-list">
              {items.length === 0 ? (
                <p className="nc-empty">No notifications yet.</p>
              ) : (
                items.map((n) => (
                  <div
                    key={n._id}
                    className={`nc-item ${n.isRead ? "" : "unread"}`}
                    onClick={() => markRead(n)}
                  >
                    <div className="nc-item-title">
                      {!n.isRead && <span className="nc-dot"></span>}
                      {n.title}
                    </div>

                    <p>{n.message}</p>
                    <small>{new Date(n.createdAt).toLocaleString()}</small>

                    {needsDecision(n) && (
                      <div className="nc-actions" onClick={(e) => e.stopPropagation()}>
                        {n.actionTaken ? (
                          <span className={`nc-decision ${n.actionTaken.toLowerCase()}`}>
                            {n.actionTaken === "Approved" ? "✓ Approved" : "✕ Rejected"}
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="nc-approve"
                              disabled={busyId === n._id}
                              onClick={() => decide(n, "Approved")}
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="nc-reject"
                              disabled={busyId === n._id}
                              onClick={() => decide(n, "Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function NotificationCenter() {
  const zoom = useUiZoom();
  const [sessions, setSessions] = useState(readSessions);

  // Login / logout hone par bell khud aa jati hai ya chali jati hai
  useEffect(() => {
    const timer = setInterval(() => {
      const next = readSessions();
      setSessions((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? cur : next));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  if (sessions.length === 0) return null;

  return (
    <div className="nc-wrap" style={zoom > 1 ? { zoom } : undefined}>
      {sessions.map((s) => (
        <Bell key={`${s.id}-${s.token}`} session={s} />
      ))}
    </div>
  );
}