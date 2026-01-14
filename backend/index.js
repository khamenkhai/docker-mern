const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);
app.use(express.json());

// 1. Schema & Model
const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);

// 2. Logging Middleware
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

// 3. CRUD Routes
// CREATE
app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Create Error:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});
// READ (All)
app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// UPDATE
app.put("/api/items/:id", async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  console.log("🔄 Item Updated");
  res.json(updated);
});

// DELETE
app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  console.log("🗑️ Item Deleted");
  res.json({ message: "Deleted" });
});

// Health Check
app.get("/api/status", (req, res) => {
  res.json({
    message: "Backend is running! 🚀",
    database:
      mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
  });
});

const mongoUri = process.env.MONGO_URL; // Should be mongodb://db:27017/...

const connectWithRetry = () => {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ DB Error, retrying in 5 seconds...", err.message);
      setTimeout(connectWithRetry, 3000); // Retry every 5 seconds
    });
};

connectWithRetry();

app.listen(3000, () => console.log("🚀 Server on port 3000"));
