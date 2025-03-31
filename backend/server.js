const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Model
const Password = require("./models/Password");

// Routes
// Save password
app.post("/api/save", async (req, res) => {
    try {
        const { website, username, password } = req.body;
        const newPassword = new Password({ website, username, password });
        await newPassword.save();
        res.status(201).json({_id:newPassword._id});
    } catch (err) {
        res.status(500).json({ error: "Failed to save password" });
    }
});

app.delete("/api/delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extracting the ID from the query parameter
        if (!id) {
            return res.status(400).json({ error: "ID is required to delete the password" });
        }
        const deletedPassword = await Password.findByIdAndDelete(id);
        if (!deletedPassword) {
            return res.status(404).json({ error: "Password not found" });
        }
        res.status(200).json({ message: "Password deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete password" });
    }
});

// Get all passwords
app.get("/api/passwords", async (req, res) => {
    try {
        const passwords = await Password.find();
        res.status(200).json(passwords);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve passwords" });
    }
});

app.get("/", async (req, res) => {
    try {
        res.status(200).json("success");
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve passwords" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
