import { useState, useEffect, useRef } from "react";
import {
    Bell,
    ShoppingCart,
    Package,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { router } from "@inertiajs/react";

export default function SupplierNotificationDropdown({
    notifications = [],
    unreadCount = 0,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    /* CLOSE ON OUTSIDE CLICK */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ICONS */
    const getNotificationIcon = (type) => {
        switch (type) {
            case "new_purchase_order":
                return <ShoppingCart className="w-5 h-5 text-amber-500" />;

            case "stock_added":
                return <Package className="w-5 h-5 text-emerald-500" />;

            case "low_stock":
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;

            case "purchase_order_received":
                return <CheckCircle className="w-5 h-5 text-blue-500" />;

            case "purchase_order_cancelled":
                return <XCircle className="w-5 h-5 text-red-500" />;

            default:
                return <Bell className="w-5 h-5 text-stone-500" />;
        }
    };

    /* MARK SINGLE */
    const handleNotificationClick = (id, actionUrl) => {
        router.post(
            "/supplier/notifications/mark-as-read",
            { notification_id: id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (actionUrl) router.visit(actionUrl);
                },
            }
        );
    };

    /* MARK ALL */
    const handleMarkAllAsRead = () => {
        router.post(
            "/supplier/notifications/mark-all-read",
            {},
            {
                preserveScroll: true,
                onSuccess: () => setIsOpen(false),
            }
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-stone-400 hover:text-white"
            >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-black border border-stone-800 rounded-lg shadow-xl z-50">

                    {/* Header */}
                    <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-white">
                                Supplier Notifications
                            </h3>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-white/80 hover:text-white"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-stone-800">

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                                <p className="text-stone-400 text-sm">
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const isUnread = !notification.read_at;
                                const data = notification.data || {};

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification.id,
                                                data.action_url
                                            )
                                        }
                                        className={`p-4 cursor-pointer hover:bg-stone-900 ${isUnread ? "bg-stone-900/60" : ""
                                            }`}
                                    >
                                        <div className="flex gap-3">

                                            <div>
                                                {getNotificationIcon(data.type)}
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm text-stone-200">
                                                    {data.message}
                                                </p>

                                                {data.po_number && (
                                                    <p className="text-xs text-amber-400">
                                                        PO: {data.po_number}
                                                    </p>
                                                )}

                                                <p className="text-xs text-stone-500">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>

                                            {isUnread && (
                                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
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
