const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require("./routes/auth");            // ✅ Fixed
const stockRoutes = require('./routes/StockRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

const app = express();

// ✅ Middleware: CORS for frontend access
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ✅ Middleware: JSON parser
app.use(express.json());

// ✅ Route handling
app.use("/api/auth", authRoutes);                      // ✅ Added to handle signup/login
app.use("/api/stocks", stockRoutes);
app.use("/api/warehouses", warehouseRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
