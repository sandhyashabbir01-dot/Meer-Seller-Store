const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    registrationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);