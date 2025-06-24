import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddStock from "./pages/AddStock";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen bg-gray-100">
          <Navbar />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddStock />} />

              {/* Add more routes as you build them */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

