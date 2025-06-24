const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const verifyToken = require("./verifytoken.js");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Models
const Password = require("./models/Password");
const Users = require("./models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Signup
app.post("/api/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const userExists = await Users.findOne({ email });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ userName, email, password: hashedPassword });
    await user.save();
    console.log("User created with id:", user._id);
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.userName, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.userName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Save Password
app.post("/api/save", verifyToken, async (req, res) => {
    
  try {
    const { website, username, password } = req.body;
    const newPassword = new Password({
      website,
      username,
      password,
      user: req.user.id
    });
    await newPassword.save();
    res.status(201).json({ _id: newPassword._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save password" });
  }
});

// Delete Password
app.delete("/api/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const password = await Password.findById(id);

    if (!password) return res.status(404).json({ error: "Password not found" });
    if (password.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await Password.findByIdAndDelete(id);
    res.status(200).json({ message: "Password deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete password" });
  }
});

// Get All Passwords for Authenticated User
app.get("/api/passwords", verifyToken, async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user.id });
    res.status(200).json(passwords);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve passwords" });
  }
});

// Token Check Route
app.get("/", verifyToken, (req, res) => {
  res.status(200).json("success");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
