import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WarehouseBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">🏭 Stock per Warehouse</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="warehouseId" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
