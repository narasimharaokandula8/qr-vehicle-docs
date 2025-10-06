import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Route imports
import authRoutes from "./routes/auth.js";       // login/signup routes
import uploadRoutes from "./routes/upload.js";   // upload vehicle docs
import documentRoutes from "./routes/documents.js"; // get user docs
import paymentRoutes from "./routes/payments.js"; // payments

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Basic security headers (non-breaking)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  // Keep CSP relaxed for dev; tighten in prod
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'");
  next();
});
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", documentRoutes);
app.use("/api", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Vehicle Docs Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
