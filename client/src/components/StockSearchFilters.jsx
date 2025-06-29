import { useState } from "react";

const StockSearchFilters = ({ stocks = [], onFilter }) => {
  const [filters, setFilters] = useState({
    itemName: "",
    batchNumber: "",
    warehouseId: "",
    category: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const unique = (key) => [...new Set(stocks.map((s) => s[key]))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const filtered = stocks.filter((s) => {
      const stockDate = new Date(s.dateOfEntry);
      const fromDate = updated.dateFrom ? new Date(updated.dateFrom) : null;
      const toDate = updated.dateTo ? new Date(updated.dateTo) : null;

      return (
        (!updated.itemName || s.itemName === updated.itemName) &&
        (!updated.batchNumber || s.batchNumber === updated.batchNumber) &&
        (!updated.warehouseId || s.warehouseId === updated.warehouseId) &&
        (!updated.category || s.category === updated.category) &&
        (!updated.status || s.status === updated.status) &&
        (!fromDate || stockDate >= fromDate) &&
        (!toDate || stockDate <= toDate)
      );
    });

    onFilter(filtered);
  };

  const handleReset = () => {
    setFilters({
      itemName: "",
      batchNumber: "",
      warehouseId: "",
      category: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    onFilter(stocks);
  };

  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-4">
        <select name="itemName" value={filters.itemName} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Items</option>
          {unique("itemName").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select name="batchNumber" value={filters.batchNumber} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Batches</option>
          {unique("batchNumber").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select name="warehouseId" value={filters.warehouseId} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Warehouses</option>
          {unique("warehouseId").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select name="category" value={filters.category} onChange={handleChange} className="p-2 border rounded">
          <option value="">All Categories</option>
          {unique("category").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={handleChange} className="p-2 border rounded">
          <option value="">Any Status</option>
          {unique("status").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* 📅 Date filters */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm mb-1 text-gray-700">Added On or After</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Added Before</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded transition"
        >
          🔄 Reset Filters
        </button>
      </div>
    </div>
  );
};

export default StockSearchFilters;
