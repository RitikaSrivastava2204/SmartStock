import StockPieChart from "./StockPieChart";
import WarehouseBarChart from "./WarehouseBarChart";
import StockLineChart from "./StockLineChart";
import ThresholdAlertChart from "./ThresholdAlertChart";

const Charts = ({ stocks, warehouseStockData = [], warehouses = [] }) => {
  // 🥧 Pie chart data by category
  const categoryData = stocks.reduce((acc, s) => {
    const found = acc.find((i) => i.category === s.category);
    found ? (found.quantity += +s.quantity) : acc.push({ category: s.category, quantity: +s.quantity });
    return acc;
  }, []);

  // 🏭 Bar chart data by warehouse (ensure even 0-stock ones appear)
  const warehouseData = warehouses.map((wh) => {
    const stockItems = stocks.filter((s) => s.warehouseId === wh.warehouseId);
    const totalQuantity = stockItems.reduce((sum, s) => sum + Number(s.quantity), 0);
    return {
      warehouseId: wh.warehouseId,
      quantity: totalQuantity,
    };
  });
  

  // 📈 Line chart - stock entries per day
  const dateData = stocks.reduce((acc, s) => {
    const date = new Date(s.dateOfEntry).toLocaleDateString("en-IN");
    const found = acc.find((i) => i.date === date);
    found ? found.count++ : acc.push({ date, count: 1 });
    return acc;
  }, []);

  // ⚠️ Area chart - threshold alerts per current date
  const alertData = stocks.reduce((acc, s) => {
    const entry = new Date(s.dateOfEntry);
    const today = new Date();
    const age = Math.floor((today - entry) / (1000 * 60 * 60 * 24));
    const threshold = parseInt(s.thresholdAge);
    if (age >= threshold) {
      const date = today.toLocaleDateString("en-IN");
      const found = acc.find((i) => i.date === date);
      found ? found.alerts++ : acc.push({ date, alerts: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <StockPieChart data={categoryData} />
      <WarehouseBarChart data={warehouseData} />
      <StockLineChart data={dateData} />
      <ThresholdAlertChart data={alertData} />
    </div>
  );
};

export default Charts;
