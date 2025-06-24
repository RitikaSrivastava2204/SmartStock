const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const stockRoutes = require('./routes/StockRoutes');

const app = express();

// ✅ Use CORS middleware with origin set to frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

// ✅ Middleware to parse JSON
app.use(express.json());


// ✅ Routes
app.use("/api/stocks", stockRoutes);

// ✅ DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
