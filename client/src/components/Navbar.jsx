import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Menu } from "lucide-react";

export default function Navbar({ setIsMobileOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/stocks/manage");
      const today = new Date();
      const notifList = [];

      res.data.forEach((stock) => {
        const entryDate = new Date(stock.dateOfEntry);
        const age = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        const threshold = parseInt(stock.thresholdAge);

        if (age >= threshold) {
          notifList.push(
            `⚠️ ${stock.itemName} (Batch ${stock.batchNumber}) has crossed its threshold age of ${threshold} days.`
          );
        } else if (threshold - age <= 2) {
          notifList.push(
            `⏰ ${stock.itemName} (Batch ${stock.batchNumber}) is nearing threshold age (${threshold - age} day(s) left).`
          );
        }
      });

      setNotifications(notifList);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-slate-800 text-white flex items-center justify-between px-4 sm:px-6 shadow z-40">
      {/* 📱 Hamburger for mobile */}
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

      {/* 🔔 Notification + Welcome */}
      <div className="flex items-center gap-6 relative">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative focus:outline-none"
          >
            <Bell className="w-6 h-6 text-white hover:text-gray-300 transition duration-200" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>

          {/* 📋 Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 shadow-xl rounded-md p-4 z-50 max-h-64 overflow-y-auto border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">
                Notifications
              </h4>
              {notifications.length > 0 ? (
                notifications.map((note, idx) => (
                  <div
                    key={idx}
                    className="text-sm mb-2 border-b border-gray-200 pb-2"
                  >
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No notifications.</p>
              )}
            </div>
          )}
        </div>

        <div className="text-sm font-medium hidden sm:block">
          Welcome, <span className="underline">STORE ADMIN</span>
        </div>
      </div>
    </header>
  );
}
