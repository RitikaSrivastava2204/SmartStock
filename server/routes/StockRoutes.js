const express = require('express');
const router = express.Router();
const StockItem = require('../models/StockItem');

router.post('/add', async (req, res) => {
  console.log("📥 Received data in backend:", req.body); // ✅ Check what's coming from frontend

  try {
    const stock = new StockItem(req.body);
    await stock.save();
    res.status(201).json({ message: 'Stock saved successfully', stock });
  } catch (error) {
    console.error("❌ Error saving stock:", error);
    res.status(500).json({ error: 'Error saving stock' });
  }
});


module.exports = router;
