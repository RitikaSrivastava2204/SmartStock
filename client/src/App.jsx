import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddStock from "./pages/AddStock";
import ManageStock from './pages/ManageStock';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout>
              <AddStock />
            </Layout>
          }
        />
        <Route
          path="/manage"
          element={
            <Layout>
              <ManageStock />
            </Layout>
          }
        />
        {/* Add more routes like /warehouses, /reports etc. */}
      </Routes>
    </Router>
  );
}

export default App;
