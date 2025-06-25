import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Boxes,
  Warehouse,
  FileText,
  Settings
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Add Stock", path: "/add", icon: PlusCircle },
  { label: "Manage Stock", path: "/manage", icon: Boxes },
  { label: "Warehouses", path: "/warehouses", icon: Warehouse },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({
  isExpanded,
  setIsExpanded,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-screen bg-slate-800 text-white fixed top-0 left-0 shadow-lg z-50 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent
          isExpanded={isExpanded}
          toggleSidebar={toggleSidebar}
          location={location}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex lg:hidden"
          onClick={closeMobile}
        >
          <aside
            className="w-64 h-full bg-slate-800 text-white shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside sidebar
          >
            <SidebarContent
              isExpanded={true}
              toggleSidebar={closeMobile}
              location={location}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ isExpanded, toggleSidebar, location }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {isExpanded && (
          <h1 className="text-xl font-bold tracking-wide">SmartStock</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white"
        >
          {isExpanded ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className="mt-6 flex flex-col space-y-2 px-2">
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-4 py-2 px-3 rounded hover:bg-slate-700 transition ${
              location.pathname === path ? "bg-slate-700" : ""
            }`}
            title={!isExpanded ? label : ""}
          >
            <Icon size={20} className="shrink-0" />
            {isExpanded && <span className="text-sm">{label}</span>}
          </Link>
        ))}
      </nav>
    </>
  );
}
