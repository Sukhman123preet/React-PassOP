// models/Password.js
const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // This should match the model name in userSchema
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Password", passwordSchema);
