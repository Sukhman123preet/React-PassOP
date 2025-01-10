const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
    website: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Store encrypted passwords
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Password", passwordSchema);
