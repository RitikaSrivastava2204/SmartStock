import { useState, useEffect } from 'react';
import axios from "axios";
import BarcodeScanner from "../components/BarcodeScanner";

export default function AddStock() {
  const [formData, setFormData] = useState({
    itemName: '',
    batchNumber: '',
    category: '',
    quantity: '',
    unit: 'pcs',
    warehouseId: '',
    rackId: '',
    dateOfEntry: '',
    thresholdAge: '',
    status: 'active',
  });

  const [warehouses, setWarehouses] = useState([]);
  const [showScanner, setShowScanner] = useState(false); // ✅ New toggle for scanner

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/warehouses");
        setWarehouses(res.data);
      } catch (error) {
        console.error("❌ Error fetching warehouses:", error);
      }
    };

    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle barcode result
  const handleBarcodeScan = (scannedText) => {
    setFormData((prev) => ({
      ...prev,
      batchNumber: scannedText, // or itemName if you prefer
    }));
    setShowScanner(false); // auto-hide after scanning
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending this data:", formData);
      const res = await axios.post("http://localhost:5050/api/stocks/add", formData);
      alert("✅ Stock item added!");
      console.log(res.data);

      // Reset form
      setFormData({
        itemName: '',
        batchNumber: '',
        category: '',
        quantity: '',
        unit: 'pcs',
        warehouseId: '',
        rackId: '',
        dateOfEntry: '',
        thresholdAge: '',
        status: 'active',
      });
    } catch (error) {
      console.error("Error saving stock:", error);
      alert("❌ Failed to add stock. See console for error.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Stock Item</h2>

      {/* ✅ Toggle Scanner Button */}
      <button
        type="button"
        onClick={() => setShowScanner(!showScanner)}
        className="mb-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {showScanner ? "Hide Scanner" : "Scan Barcode for Batch Number"}
      </button>

      {/* ✅ Barcode Scanner Component */}
      {showScanner && (
        <div className="mb-6">
          <BarcodeScanner onScanSuccess={handleBarcodeScan} onClose={() => setShowScanner(false)} />
        </div>
      )}

      {/* ✅ Your original form unchanged */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-3xl space-y-4">
        <div>
          <label className="block font-medium mb-1">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Batch Number</label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
              min="1"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="meters">meters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Warehouse</label>
            <select
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh._id} value={wh.warehouseId}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Rack ID</label>
            <input
              type="text"
              name="rackId"
              value={formData.rackId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Date of Entry</label>
            <input
              type="date"
              name="dateOfEntry"
              value={formData.dateOfEntry}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Threshold Age (days)</label>
            <input
              type="number"
              name="thresholdAge"
              value={formData.thresholdAge}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="removed">Removed</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="reset"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() =>
              setFormData({
                itemName: '',
                batchNumber: '',
                category: '',
                quantity: '',
                unit: 'pcs',
                warehouseId: '',
                rackId: '',
                dateOfEntry: '',
                thresholdAge: '',
                status: 'active',
              })
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Stock
          </button>
        </div>
      </form>
    </div>
  );
}
