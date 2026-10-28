import { useState, useEffect, useCallback, useRef } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NotificationsDrawer = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchWithAuth("/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Non-blocking
    }
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchWithAuth("/notifications?limit=20");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll unread count every 45s
    const interval = setInterval(fetchUnreadCount, 45000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetchWithAuth("/notifications/read-all", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.info("All notifications marked as read");
      }
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const resolveTargetLink = (notif) => {
    const role = localStorage.getItem("role") || "user";
    const raw = notif.link || "";

    if (raw.includes("applied") || raw.includes("application")) {
      return role === "company" ? "/company/postedjobs" : "/profile/appliedjobs";
    }
    if (raw.includes("interview") || raw.includes("offer")) {
      return role === "company" ? "/company/postedjobs" : "/profile/offers";
    }
    if (raw.startsWith("/company")) {
      return raw;
    }
    if (raw.startsWith("/profile")) {
      return raw;
    }

    // Type-based fallbacks
    if (notif.type === "new_applicant") {
      return "/company/postedjobs";
    }
    if (notif.type === "interview" || notif.type === "offer") {
      return role === "company" ? "/company/postedjobs" : "/profile/offers";
    }
    if (notif.type === "application_status") {
      return role === "company" ? "/company/postedjobs" : "/profile/appliedjobs";
    }

    return role === "company" ? "/company/postedjobs" : "/profile/appliedjobs";
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await fetchWithAuth(`/notifications/${notif._id}/read`, {
          method: "PATCH",
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // Non-blocking
      }
    }
    setIsOpen(false);
    const targetLink = resolveTargetLink(notif);
    navigate(targetLink);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition rounded-full hover:bg-gray-100"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-blue-50 cursor-pointer transition flex items-start gap-3 ${
                    !notif.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                      !notif.read ? "bg-blue-600" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDrawer;
