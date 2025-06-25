import { useEffect, useState } from "react";
import axios from "axios";

const ManageStock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/stocks/manage");
      setStocks(res.data);
    } catch (error) {
      console.error("❌ Error fetching stock:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Manage Stock
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-900 text-left">
                <th className="px-6 py-4 font-semibold">Item Name</th>
                <th className="px-6 py-4 font-semibold">Batch #</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Warehouse</th>
                <th className="px-6 py-4 font-semibold">Rack</th>
                <th className="px-6 py-4 font-semibold">Date of Entry</th>
                <th className="px-6 py-4 font-semibold">Threshold Age</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((stock) => (
                  <tr
                    key={stock._id}
                    className="hover:bg-gray-50 border-t transition"
                  >
                    <td className="px-6 py-4">{stock.itemName}</td>
                    <td className="px-6 py-4">{stock.batchNumber}</td>
                    <td className="px-6 py-4">{stock.category}</td>
                    <td className="px-6 py-4">
                      {stock.quantity} {stock.unit}
                    </td>
                    <td className="px-6 py-4">{stock.warehouseId}</td>
                    <td className="px-6 py-4">{stock.rackId}</td>
                    <td className="px-0 py-4">
                      {new Date(stock.dateOfEntry).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">{stock.thresholdAge} days</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          stock.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {stock.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 rounded-lg text-sm bg-blue-500 hover:bg-blue-700 text-white transition">
                          Edit
                        </button>
                        <button className="px-3 py-1 rounded-lg text-sm bg-red-500 hover:bg-red-700 text-white transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center px-6 py-8 text-gray-500 italic"
                  >
                    No stock available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStock;
