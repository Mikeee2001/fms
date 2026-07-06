import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { router } from "@inertiajs/react";

export default function SupplierNotificationDropdown({
    notifications = [],
    unread = 0,
    refresh,
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const markAllAsRead = async () => {
        if (loading) return;

        setLoading(true);
        try {
            await axios.post("/supplier/notifications/mark-all-as-read");
            refresh?.();
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notif) => {
        if (loading) return;

        try {
            setLoading(true);

            await axios.post("/supplier/notifications/mark-as-read", {
                notification_id: notif.id,
            });

            refresh?.();
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (notif) => {
        await markAsRead(notif);

        setOpen(false);

        if (notif.action_url) {
            router.visit(notif.action_url);
        }
    };

    return (
        <div className="relative">

            {/* Bell */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-stone-900 transition"
            >
                <Bell className="w-6 h-6 text-white" />

                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-96 bg-black border border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
                        <h3 className="text-white font-semibold">
                            Notifications
                        </h3>

                        {unread > 0 && (
                            <button
                                onClick={markAllAsRead}
                                disabled={loading}
                                className="text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Mark all read"}
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="max-h-96 overflow-y-auto">

                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-stone-500 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const isUnread = !n.read_at;

                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleClick(n)}
                                        className={`group px-4 py-3 border-b border-stone-900 cursor-pointer transition hover:bg-stone-900/70 ${isUnread ? "bg-stone-900/40" : ""
                                            }`}
                                    >

                                        {/* Message */}
                                        <p className="text-sm text-white font-medium group-hover:text-amber-300 transition">
                                            {n.message}
                                        </p>

                                        {/* PO */}
                                        {n.po_number && (
                                            <p className="text-xs text-amber-400 mt-1">
                                                PO #{n.po_number}
                                            </p>
                                        )}

                                        {/* Details */}
                                        {n.order_details && (
                                            <div className="mt-2 text-xs text-stone-400 space-y-1">
                                                <p>
                                                    Supplier:{" "}
                                                    <span className="text-white">
                                                        {n.order_details.supplier_name}
                                                    </span>
                                                </p>

                                                <p>
                                                    Items:{" "}
                                                    <span className="text-white">
                                                        {n.order_details.total_items}
                                                    </span>
                                                </p>

                                                <p>
                                                    Total:{" "}
                                                    <span className="text-emerald-400">
                                                        ₱{n.order_details.total_amount}
                                                    </span>
                                                </p>

                                                <p>
                                                    Status:{" "}
                                                    <span className="text-amber-400">
                                                        {n.order_details.status}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[11px] text-stone-500">
                                                {new Date(n.created_at).toLocaleString()}
                                            </p>

                                            {isUnread && (
                                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
