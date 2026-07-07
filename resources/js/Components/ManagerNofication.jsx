import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ManagerNotificationDropdown({
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
            await axios.post(
                "/manager/notifications/mark-all-as-read"
            );

            refresh?.();

        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notif) => {
        try {
            await axios.post(
                "/manager/notifications/mark-as-read",
                {
                    notification_id: notif.id,
                }
            );

            refresh?.();

        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = async (notif) => {
        await markAsRead(notif);

        setOpen(false);

        if (notif.po_id) {
            router.visit(
                route(
                    "manager.purchase-orders.show",
                    notif.po_id
                )
            )
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
                                className="text-xs text-amber-400 hover:text-amber-300"
                            >
                                Mark all read
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
                                const unreadItem = !n.read_at;

                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleClick(n)}
                                        className={`group px-4 py-3 border-b border-stone-900 cursor-pointer hover:bg-stone-900 transition ${unreadItem
                                            ? "bg-stone-900/40"
                                            : ""
                                            }`}
                                    >
                                        <p className="text-white text-sm font-medium">
                                            {n.message}
                                        </p>

                                        {n.status && (
                                            <p className="text-xs text-sky-400 mt-1">
                                                Status: {n.status}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[11px] text-stone-500">
                                                {new Date(
                                                    n.created_at
                                                ).toLocaleString()}
                                            </p>

                                            {unreadItem && (
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
