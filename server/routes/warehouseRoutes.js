const express = require("express");
const router = express.Router();
const Warehouse = require("../models/Warehouse");

// POST: Add new warehouse
router.post("/add", async (req, res) => {
  try {
    const newWarehouse = new Warehouse(req.body);
    await newWarehouse.save();
    res.status(201).json({ message: "Warehouse added successfully" });
  } catch (error) {
    console.error("❌ Error saving warehouse:", error);
    res.status(500).json({ error: "Failed to add warehouse" });
  }
});

// GET: Fetch all warehouses
router.get("/", async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    console.error("❌ Error fetching warehouses:", error);
    res.status(500).json({ error: "Failed to fetch warehouses" });
  }
});

router.delete('/:id', async (req, res) => {
  await Warehouse.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

router.put('/:id', async (req, res) => {
  const updated = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
