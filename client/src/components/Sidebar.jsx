import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Add Stock", path: "/add" },
  { label: "Manage Stock", path: "/manage" },
  { label: "Warehouses", path: "/warehouses" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
    const location = useLocation();
  
    return (
      <aside className="w-64 h-screen bg-slate-800 text-white fixed top-0 left-0 shadow-lg z-50">
        <div className="text-2xl font-bold px-6 py-4 border-b border-slate-700 tracking-wide">
           SmartStock
        </div>
        <nav className="mt-6 flex flex-col space-y-2 px-4">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`py-2 px-4 rounded hover:bg-slate-700 transition ${
                location.pathname === path ? "bg-slate-700" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    );
  }
  
