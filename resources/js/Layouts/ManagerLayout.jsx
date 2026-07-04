import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import NotificationDropdown from '@/Components/NotificationDropdown';
import { useToast } from "@/Contexts/ToastContext";
import {
    LayoutDashboard,
    Factory,
    ShoppingCart,
    Users,
    Boxes,
    ClipboardList,
    Truck,
    FileBarChart2,
} from "lucide-react";

export default function ManagerLayout({ children }) {

    const { auth } = usePage().props;
    const { flash } = usePage().props;
    const { showToast } = useToast();

    const user = auth?.user;
    const notifications = auth?.notifications || [];
    const unreadCount = auth?.unread_count || 0;

    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Auto refresh notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['auth'],
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            showToast("success", "Success", flash.success);
        }

        if (flash?.error) {
            showToast("error", "Error", flash.error);
        }

        if (flash?.info) {
            showToast("info", "Info", flash.info);
        }
    }, [flash]);

    // Manager Navigation
    const navigationGroups = [
        {
            title: "Overview",
            items: [
                {
                    name: "Dashboard",
                    href: "/manager/dashboard",
                    icon: LayoutDashboard,
                },
            ],
        },

        {
            title: "Production Progress",
            items: [
                {
                    name: "Track Production Progress",
                    href: "#", // Replace with your route
                    icon: Factory,
                },
            ],
        },

        {
            title: "Purchasing",
            items: [
                {
                    name: "Purchase Orders",
                    href: "#", // Replace with your route
                    icon: ShoppingCart,
                },
                {
                    name: "Suppliers",
                    href: "#", // Replace with your route
                    icon: Users,
                },
            ],
        },

        {
            title: "Inventory",
            items: [
                {
                    name: "Inventory",
                    href: "/manager/inventory",
                    icon: Boxes,
                },
                {
                    name: "Material Requests",
                    href: "/manager/raw-material-requests",
                    icon: ClipboardList,
                },
                {
                    name: "Raw Material Page",
                    href: "/manager/raw-materials",
                    icon: ClipboardList,
                },
            ],
        },

        {
            title: "Deliveries",
            items: [
                {
                    name: "Deliveries",
                    href: "#", // Replace with your route
                    icon: Truck,
                },
            ],
        },

        {
            title: "Reports",
            items: [
                {
                    name: "Reports",
                    href: "#", // Replace with your route
                    icon: FileBarChart2,
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
                        href="/manager/dashboard"
                        className="flex items-center space-x-2"
                    >
                        <svg
                            className="h-7 w-7 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>

                        <span className="font-bold text-lg text-white">
                            Arfeels Manager
                        </span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-stone-400 hover:text-white"
                    >
                        ✕
                    </button>

                </div>

                {/* Navigation */}
                <nav className="mt-3 px-2 overflow-y-auto h-[calc(100vh-8rem)]">

                    {navigationGroups.map((group, index) => (

                        <div key={group.title} className="mb-4">

                            <div className="px-2 mb-2">
                                <h3 className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                                    {group.title}
                                </h3>
                            </div>

                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-amber-500 transition-all duration-200 mb-1 text-sm"
                                    >
                                        <Icon
                                            size={18}
                                            className="mr-3 text-stone-400 group-hover:text-amber-500"
                                        />

                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                            {index < navigationGroups.length - 1 && (
                                <div className="border-t border-stone-800 my-3"></div>
                            )}

                        </div>

                    ))}

                </nav>

                {/* User */}
                <div className="absolute bottom-0 w-full border-t border-stone-800 bg-black p-3">

                    <div className="flex items-center justify-between">

                        <div className="min-w-0">

                            <p className="text-white text-sm font-medium truncate">
                                {user.name}
                            </p>

                            <p className="text-stone-400 text-xs truncate">
                                {user.email}
                            </p>

                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-amber-500 hover:text-amber-400 text-xs"
                        >
                            Logout
                        </Link>

                    </div>

                </div>

            </div>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'md:pl-64' : ''}`}>

                {/* Topbar */}
                <nav className="bg-black border-b border-stone-800 sticky top-0 z-20">

                    <div className="px-6">

                        <div className="flex justify-between items-center h-14">

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-stone-400 hover:text-white"
                            >
                                ☰
                            </button>

                            <div className="flex items-center space-x-4">

                                <NotificationDropdown
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    userType="manager"
                                />

                                <span className="text-stone-400 text-sm">
                                    Welcome, {user.name}
                                </span>

                            </div>

                        </div>

                    </div>

                </nav>

                {/* Page Content */}
                <main className="py-4 px-6">
                    {children}
                </main>

            </div>

            <ConfirmDialog />

        </div>
    );
}
