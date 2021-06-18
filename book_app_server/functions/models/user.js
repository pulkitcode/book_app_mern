const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", userSchema);
