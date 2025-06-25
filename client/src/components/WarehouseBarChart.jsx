import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WarehouseBarChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">🏭 Stock per Warehouse</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="warehouseId" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantity" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default WarehouseBarChart;
