import { Link } from "react-router-dom";
import boxes from '../assets/boxes.svg'; // adjust path based on location


export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Total Items" value={0} color="indigo" />
        <SummaryCard label="Warehouses" value={0} color="teal" />
        <SummaryCard label="Threshold Alerts" value={0} color="yellow" />
        <SummaryCard label="Expired Items" value={0} color="rose" />
      </div>

      {/* 🙈 Empty State */}
      <div className="mt-12 text-center">
        <img
          src={boxes}
          alt="No stock illustration"
          className="mx-auto w-52 opacity-60"
        />
        <p className="text-gray-600 text-lg mt-6">No stock items added yet.</p>
        <Link to="/add">
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow">
             Add Your First Stock
          </button>
        </Link>
      </div>
    </div>
  );
}

// ✅ Mini Card Component
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
