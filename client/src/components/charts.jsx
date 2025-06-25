import StockPieChart from "./StockPieChart";
import WarehouseBarChart from "./WarehouseBarChart";
import StockLineChart from "./StockLineChart";
import ThresholdAlertChart from "./ThresholdAlertChart";

const Charts = ({ stocks }) => {
  // 🥧 Pie chart data
  const categoryData = stocks.reduce((acc, s) => {
    const found = acc.find((i) => i.category === s.category);
    found ? found.quantity += +s.quantity : acc.push({ category: s.category, quantity: +s.quantity });
    return acc;
  }, []);

  // 🏭 Bar chart data
  const warehouseData = stocks.reduce((acc, s) => {
    const found = acc.find((i) => i.warehouseId === s.warehouseId);
    found ? found.quantity += +s.quantity : acc.push({ warehouseId: s.warehouseId, quantity: +s.quantity });
    return acc;
  }, []);

  // 📈 Line chart (stocks added per date)
  const dateData = stocks.reduce((acc, s) => {
    const date = new Date(s.dateOfEntry).toLocaleDateString("en-IN");
    const found = acc.find((i) => i.date === date);
    found ? found.count++ : acc.push({ date, count: 1 });
    return acc;
  }, []);

  // ⚠️ Area chart (alerts per date)
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
