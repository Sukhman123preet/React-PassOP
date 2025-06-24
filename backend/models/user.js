const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true }, // Store encrypted passwords
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Users", userSchema);
