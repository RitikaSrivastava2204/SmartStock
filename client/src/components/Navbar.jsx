import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navbar({ setIsMobileOpen }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-slate-800 text-white flex items-center justify-between px-4 sm:px-6 shadow z-40">
      {/* 📱 Hamburger */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-white hover:text-gray-300"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold whitespace-nowrap">
          Interplant Store Management System
        </h1>
      </div>

      {/* 🔔 Notifications + User Info */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        {user ? (
          <>
            <div className="text-sm font-medium">
              Welcome, <span className="underline">{user.name || user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="text-sm italic text-gray-300">Not logged in</div>
        )}
      </div>
    </header>
  );
}
