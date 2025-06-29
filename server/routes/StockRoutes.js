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

// GET all stock items
router.get('/manage', async (req, res) => {
  try {
    const stocks = await StockItem.find(); // fetch all stocks from MongoDB
    res.status(200).json(stocks);
  } catch (error) {
    console.error("❌ Error fetching stocks:", error);
    res.status(500).json({ error: 'Error fetching stock' });
  }
});

// DELETE stock by ID
router.delete('/:id', async (req, res) => {
  try {
    const stock = await StockItem.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: "Stock item not found" });
    }
    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting stock:", error);
    res.status(500).json({ error: "Failed to delete stock item" });
  }
});






module.exports = router;
