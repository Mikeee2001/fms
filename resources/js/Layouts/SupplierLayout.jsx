import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useToast } from "@/Contexts/ToastContext";
import {
    HiHome,
    HiCube,
    HiCreditCard,
    HiUserCircle,
    HiClipboardList,
    HiDocument,
} from "react-icons/hi";
import SupplierNotificationDropdown from "@/Components/SupplierNotificationDropdown";

export default function SupplierLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    // Refresh shared props every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, []);


    const fetchNotifications = async () => {
        try {
            const res = await fetch('/supplier/notifications'); // adjust route
            const data = await res.json();

            setNotifications(data.notifications);
            setUnread(data.unread_count);
        } catch (error) {
            console.error('Notification fetch failed:', error);
        }
    };
    const navigationGroups = [
        {
            title: "Overview",
            items: [
                {
                    name: "Dashboard",
                    route: "supplier.dashboard",
                    icon: HiHome,
                },
            ],
        },
        {
            title: "Material Management",
            items: [
                {
                    name: "Materials",
                    route: "supplier.materials.index",
                    icon: HiCube,
                },
            ],
        },
        {
            title: "Order Management",
            items: [
                {
                    name: "Raw Material Requests",
                    route: "supplier.request.index",
                    icon: HiClipboardList,
                },
                {
                    name: "Purchase Orders",
                    route: "supplier.purchase-orders.index",
                    icon: HiDocument,
                },
            ],
        },
        {
            title: "Payments",
            items: [
                {
                    name: "Payments",
                    route: "supplier.payments.index",
                    icon: HiCreditCard,
                },
            ],
        },
        {
            title: "Account",
            items: [
                {
                    name: "Profile",
                    route: "supplier.profile.index",
                    icon: HiUserCircle,
                },
            ],
        },
    ];
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Access Denied
                    </h2>

                    <Link
                        href="/login"
                        className="text-amber-500 hover:text-amber-400"
                    >
                        Please login to continue
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-black border-r border-stone-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-3 border-b border-stone-800">

                    <Link
                        href={route('supplier.dashboard')}
                        className="flex items-center space-x-2"
                    >
                        <svg className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>

                        <span className="font-bold text-lg text-white">
                            Supplier Portal
                        </span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-stone-400 hover:text-white"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                </div>

                {/* Navigation */}
                <nav className="mt-3 px-2 overflow-y-auto h-[calc(100vh-8rem)]">

                    {navigationGroups.map((group, index) => (

                        <div key={group.title} className="mb-4">

                            <div className="px-2 mb-2">
                                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                    {group.title}
                                </h3>
                            </div>

                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={route(item.route)}
                                        className="flex items-center px-3 py-2 rounded-lg hover:bg-stone-900"
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {index !== navigationGroups.length - 1 && (
                                <div className="my-2 border-t border-stone-800"></div>
                            )}

                        </div>

                    ))}

                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 w-full border-t border-stone-800 p-3 bg-black">

                    <div className="flex items-center justify-between">

                        <div className="flex-1 min-w-0">

                            <p className="text-xs font-medium text-white truncate">
                                {user.name}
                            </p>

                            <p className="text-[10px] text-stone-400 truncate">
                                {user.email}
                            </p>

                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-xs font-medium text-amber-500 hover:text-amber-400"
                        >
                            Logout
                        </Link>

                    </div>

                </div>

            </div>

            {/* Main */}
            <div
                className={`${sidebarOpen ? 'md:pl-64' : ''
                    } transition-all duration-300`}
            >

                {/* Navbar */}
                {/* Navbar */}
                <nav className="bg-black border-b border-stone-800 sticky top-0 z-20">

                    <div className="px-4 sm:px-6 lg:px-8">

                        <div className="flex justify-between h-14">

                            {/* Left - Menu Toggle */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-stone-400 hover:text-white"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Right - Notifications + User */}
                            <div className="flex items-center space-x-4">

                                <SupplierNotificationDropdown
                                    notifications={notifications}
                                    unread={unread}
                                    refresh={fetchNotifications}
                                />

                                <span className="text-xs text-stone-400">
                                    Welcome, {user.name}
                                </span>

                            </div>

                        </div>

                    </div>

                </nav>

                {/* Content */}
                <main className="py-4 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>

            </div>

        </div>
    );
}
