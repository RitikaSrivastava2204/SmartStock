const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  itemName: String,
  batchNumber: String,
  category: String,
  quantity: Number,
  unit: String,
  warehouseId: {
    type: String,
    required: true,
  },
  rackId: {
    type: String,
    required: true,
  },
  dateOfEntry: Date,
  thresholdAge: Number,
  alertTriggered: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'sold', 'removed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('StockItem', stockSchema);
