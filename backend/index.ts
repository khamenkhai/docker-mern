import express, { Request, Response, NextFunction } from "express";
import mongoose, { Document, Schema } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*", methods: "*", allowedHeaders: "*" }));
app.use(express.json());

// 1. Interface & Model
interface IItem extends Document {
  name: string;
}

const ItemSchema: Schema = new mongoose.Schema({ name: { type: String, required: true } });
const Item = mongoose.model<IItem>("Item", ItemSchema);

// 2. Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

// 3. CRUD Routes
app.post("/api/items", async (req: Request, res: Response) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Create Error:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.get("/api/items", async (_req: Request, res: Response) => {
  const items = await Item.find();
  res.json(items);
});

app.put("/api/items/:id", async (req: Request, res: Response) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/items/:id", async (req: Request, res: Response) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Database Connection
const mongoUri: string = process.env.MONGO_URL || "mongodb://db:27017/test";

const connectWithRetry = () => {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Connected to MongoDB (TS)"))
    .catch((err) => {
      console.error("❌ DB Error, retrying...", err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.listen(3000, () => console.log("🚀 TS Server on port 3000"));