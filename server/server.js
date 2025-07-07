const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron'); // ✅ Import cron
const axios = require('axios');
require('dotenv').config();

const authRoutes = require("./routes/auth");
const stockRoutes = require('./routes/StockRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const alertRoutes = require('./routes/alertRoutes'); // ✅ NEW: Alert route added

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
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/alerts", alertRoutes); // ✅ NEW: Alert routes mounted here

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Cron Job: check alerts every hour (minute 0 of each hour)
cron.schedule('* * * * *', async () => {
  try {
    console.log('⏰ Cron job running: Checking alerts');
    await axios.get('http://localhost:5050/api/alerts/check-alerts');
  } catch (err) {
    console.error('❌ Error in cron job:', err.message);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
