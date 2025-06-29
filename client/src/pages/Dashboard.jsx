import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import boxes from "../assets/boxes.svg";
import Charts from "../components/charts";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetchStock();
    fetchWarehouses();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/stocks/manage");
      setStocks(res.data);
    } catch (error) {
      console.error("❌ Error fetching stock:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/warehouses");
      setWarehouses(res.data);
    } catch (error) {
      console.error("❌ Error fetching warehouses:", error);
    }
  };

  const totalItems = stocks.length;
  const totalWarehouses = warehouses.length;

  const expiredItems = stocks.filter((s) => s.status !== "active").length;
  const thresholdAlerts = stocks.filter((s) => {
    const entryDate = new Date(s.dateOfEntry);
    const today = new Date();
    const diffInDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    return diffInDays >= parseInt(s.thresholdAge);
  }).length;

  const recentStocks = [...stocks]
    .sort((a, b) => new Date(b.dateOfEntry) - new Date(a.dateOfEntry))
    .slice(0, 5);

  const csvHeaders = [
    { label: "Item Name", key: "itemName" },
    { label: "Batch No", key: "batchNumber" },
    { label: "Warehouse", key: "warehouseId" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit", key: "unit" },
    { label: "Date of Entry", key: "dateOfEntry" },
    { label: "Threshold Age", key: "thresholdAge" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard label="Total Items" value={totalItems} color="indigo" />
        <SummaryCard label="Warehouses" value={totalWarehouses} color="teal" />
        <SummaryCard label="Threshold Alerts" value={thresholdAlerts} color="yellow" />
        <SummaryCard label="Inactive/Expired" value={expiredItems} color="rose" />
      </div>

      {/* 🖼️ Empty State if no stock at all */}
      {stocks.length === 0 && (
        <div className="mt-16 text-center">
          <img src={boxes} alt="No stock illustration" className="mx-auto w-52 opacity-60" />
          <p className="text-gray-600 text-lg mt-6">No stock items added yet.</p>
          <Link to="/add">
            <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow">
              ➕ Add Your First Stock
            </button>
          </Link>
        </div>
      )}

      <Charts stocks={stocks} warehouses={warehouses} />

       {/* 📥 Export CSV */}
       {stocks.length > 0 && (
        <div className="mt-6 mb-4 flex justify-end mb-4">
          <CSVLink
            data={stocks}
            headers={csvHeaders}
            filename="smartstock_dashboard_data.csv"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow text-sm"
          >
             Export as CSV
          </CSVLink>
        </div>
      )}

      {/* ⚠️ High Age Stock Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">⚠️ High Age Stock Alerts</h3>
        {thresholdAlerts > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-rose-100 text-left text-rose-900">
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Batch</th>
                  <th className="px-4 py-2">Warehouse</th>
                  <th className="px-4 py-2">Date of Entry</th>
                  <th className="px-4 py-2">Threshold (days)</th>
                  <th className="px-4 py-2">Age (days)</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => {
                  const entryDate = new Date(s.dateOfEntry);
                  const today = new Date();
                  const ageInDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
                  if (ageInDays >= parseInt(s.thresholdAge)) {
                    return (
                      <tr key={s._id} className="border-t hover:bg-rose-50">
                        <td className="px-4 py-2">{s.itemName}</td>
                        <td className="px-4 py-2">{s.batchNumber}</td>
                        <td className="px-4 py-2">{s.warehouseId}</td>
                        <td className="px-4 py-2">
                          {new Date(s.dateOfEntry).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2">{s.thresholdAge}</td>
                        <td className="px-4 py-2 text-rose-600 font-semibold">{ageInDays}</td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No high-age stock currently.</p>
        )}
      </div>

      {/* ✅ Recent Entries */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">🕓 Recent Stock Entries</h3>
        {recentStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Batch</th>
                  <th className="px-4 py-2">Warehouse</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentStocks.map((stock) => (
                  <tr key={stock._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{stock.itemName}</td>
                    <td className="px-4 py-2">{stock.batchNumber}</td>
                    <td className="px-4 py-2">{stock.warehouseId}</td>
                    <td className="px-4 py-2">
                      {stock.quantity} {stock.unit}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(stock.dateOfEntry).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent stock entries.</p>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Mini Card Component
function SummaryCard({ label, value, color }) {
  const colors = {
    indigo: "border-indigo-500 text-indigo-600",
    teal: "border-teal-500 text-teal-600",
    yellow: "border-yellow-500 text-yellow-600",
    rose: "border-rose-500 text-rose-600",
  };

  return (
    <div className={`bg-white rounded-xl shadow p-4 border-t-4 ${colors[color]}`}>
      <h3 className="text-gray-500 text-sm">{label}</h3>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
