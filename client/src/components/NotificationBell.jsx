import { useEffect, useState } from "react";
import { Bell, RotateCcw, XCircle } from "lucide-react";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/alerts");
      const data = res.data;

      const notifList = data.map((alert) => ({
        type: "alert",
        message: `⚠️ ${alert.itemId?.itemName || "Unknown Item"} (Batch ${alert.itemId?.batchNumber || "-"}) has exceeded the threshold of ${alert.itemId?.thresholdAge} days.`,
        date: alert.createdAt,
      }));

      setNotifications(notifList);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none"
        aria-label="Toggle notifications"
      >
        <Bell className="w-6 h-6 text-white hover:text-gray-300 transition duration-200" />
        {notifications.length > 0 && (
          <>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {notifications.length}
            </span>
          </>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white text-gray-800 shadow-xl rounded-lg z-50 border border-gray-200 animate-fadeIn max-h-80 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-700">
              Notifications
            </h4>
            <div className="flex items-center gap-3 text-gray-600">
              <button
                title="Refresh"
                onClick={fetchNotifications}
                className="hover:text-indigo-600"
              >
                <RotateCcw size={18} />
              </button>
              <button
                title="Mark all as read"
                onClick={clearNotifications}
                className="hover:text-rose-600"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>

          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif, idx) => (
                <li
                  key={idx}
                  className={`px-4 py-3 text-sm flex gap-2 ${
                    notif.type === "alert"
                      ? "bg-red-50 text-red-800"
                      : "bg-yellow-50 text-yellow-800"
                  }`}
                >
                  <span className="flex-shrink-0 text-lg">
                    {notif.type === "alert" ? "⚠️" : "⏰"}
                  </span>
                  <div>
                    <p>{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Alert:{" "}
                      {new Date(notif.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500">
              No active notifications.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
