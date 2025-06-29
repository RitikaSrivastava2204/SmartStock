import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

export default function ReportsPage() {
  const [stocks, setStocks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ warehouseId: "", status: "", category: "" });

  useEffect(() => {
    fetchStocks();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, stocks]);

  const fetchStocks = async () => {
    const res = await axios.get("http://localhost:5050/api/stocks/manage");
    setStocks(res.data);
  };

  const fetchWarehouses = async () => {
    const res = await axios.get("http://localhost:5050/api/warehouses");
    setWarehouses(res.data);
  };

  const applyFilters = () => {
    let result = [...stocks];
    if (filters.warehouseId) result = result.filter(s => s.warehouseId === filters.warehouseId);
    if (filters.status) {
      if (filters.status === "expired") {
        result = result.filter(s => s.status !== "active");
      } else if (filters.status === "threshold") {
        result = result.filter(s => {
          const age = Math.floor((new Date() - new Date(s.dateOfEntry)) / (1000 * 60 * 60 * 24));
          return age >= parseInt(s.thresholdAge);
        });
      }
    }
    if (filters.category) result = result.filter(s => s.category === filters.category);
    setFiltered(result);
  };

  const csvHeaders = [
    { label: "Item Name", key: "itemName" },
    { label: "Batch", key: "batchNumber" },
    { label: "Warehouse", key: "warehouseId" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit", key: "unit" },
    { label: "Date of Entry", key: "dateOfEntry" },
    { label: "Status", key: "status" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4"> SmartStock Detailed Reports</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <select
          value={filters.warehouseId}
          onChange={e => setFilters({ ...filters, warehouseId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Warehouses</option>
          {warehouses.map(w => (
            <option key={w._id} value={w._id}>{w.warehouseId}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="threshold">Threshold Breached</option>
        </select>

        <input
          type="text"
          placeholder="Filter by category..."
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Export */}
      <div className="flex justify-end mb-4">
        <CSVLink
          data={filtered}
          headers={csvHeaders}
          filename="SmartStock_Report.csv"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow"
        >
          Export Filtered CSV
        </CSVLink>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Batch</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{s.itemName}</td>
                <td className="px-4 py-2">{s.batchNumber}</td>
                <td className="px-4 py-2">{s.warehouseId}</td>
                <td className="px-4 py-2">{s.quantity}</td>
                <td className="px-4 py-2">{s.unit}</td>
                <td className="px-4 py-2">{new Date(s.dateOfEntry).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-2">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-4">No records match your filters.</p>
        )}
      </div>
    </div>
  );
}
