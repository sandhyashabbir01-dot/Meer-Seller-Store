const Notification = require("../models/notification");

// Notification mein masla ho to order / registration kabhi fail nahi hoga
async function notify({ recipientType, recipientKey, title, message = "", type = "info", orderId = null, refId = "" }) {
  try {
    if (!recipientKey) return;
    await Notification.create({
      recipientType,
      recipientKey: String(recipientKey),
      title,
      message,
      type,
      orderId,
      refId,
    });
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
}

function notifyAdmins(payload) {
  return notify({ ...payload, recipientType: "admin", recipientKey: "admin" });
}

module.exports = { notify, notifyAdmins };