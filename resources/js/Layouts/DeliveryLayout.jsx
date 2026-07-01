import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';
import NotificationDropdown from '@/Components/NotificationDropdown';

export default function DeliveryLayout({ children }) {
    const { auth, cartCount: initialCartCount } = usePage().props;
    const user = auth?.user;
    const notifications = auth?.notifications || [];
    const unreadCount = auth?.unread_count || 0;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

    // Fetch pending delivery requests count for badge
    // useEffect(() => {
        // if (user?.is_admin) {
        //     const fetchPendingCount = async () => {
        //         try {
        //             const response = await axios.get(route('admin.delivery-requests.stats'));
        //             setPendingRequestsCount(response.data.pending_count);
        //         } catch (error) {
        //             console.error('Failed to fetch pending requests:', error);
        //         }
        //     };

        //     fetchPendingCount();

        //     // Refresh every 30 seconds
        //     const interval = setInterval(fetchPendingCount, 30000);
        //     return () => clearInterval(interval);
        // }
    //     if (user?.role_as === 'admin') {
    //         const fetchPendingCount = async () => {
    //             try {
    //                 const response = await axios.get(route('admin.delivery-requests.stats'));
    //                 setPendingRequestsCount(response.data.pending_count);
    //             } catch (error) {
    //                 console.error('Failed to fetch pending requests:', error);
    //             }
    //         };

    //         fetchPendingCount();

    //         const interval = setInterval(fetchPendingCount, 30000);
    //         return () => clearInterval(interval);
    //     }
    // }, [user]);


    // Auto-refresh notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Define navigation groups
    const navigationGroups = [
        {
            title: 'Overview',
            items: [
                {
                    name: 'Delivery Dashboard',
                    href: '/delivery/dashboard',
                    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                },
            ]
        },
        {
            title: 'Logistics & Operations',
            items: [
                {
                    name: 'Active Deliveries',
                    href: '/delivery/deliveries',
                    icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 5H4a2 2 0 00-2 2v9a2 2 0 002 2h1m10-13V9m0 6h-3m3 1h5l3 3v2h-1M13 5a2 2 0 012 2v8a2 2 0 01-2 2h-3'
                },
                {
                    name: 'Delivery Requests',
                    href: '/delivery/requests',
                    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                    badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
                },
                {
                    name: 'Delivery Zones',
                    href: '/delivery/zones',
                    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                },
            ]
        },
        {
            title: 'Workshop Fulfillment',
            items: [
                {
                    name: 'Production Tasks',
                    href: '/delivery/production-tasks',
                    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 001 1 2 2 0 110 4h-1a1 1 0 00-1 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
                },
            ]
        },
        {
            title: 'Staff Management',
            items: [
                {
                    name: 'Delivery Personnel',
                    href: '/delivery/personnel',
                    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
                },
            ]
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
                    <Link href="/login" className="text-amber-500 hover:text-amber-400">
                        Please login to continue
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-black border-r border-stone-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-3 border-b border-stone-800">
                    <Link href="/delivery/dashboard" className="flex items-center space-x-2">
                        <svg className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-bold text-lg text-white">Arfeels Delivery</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="mt-3 px-2 overflow-y-auto h-[calc(100vh-8rem)]">
                    {navigationGroups.map((group, groupIndex) => (
                        <div key={group.title} className="mb-4">
                            <div className="px-2 mb-1.5">
                                <h3 className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                                    {group.title}
                                </h3>
                            </div>

                            {group.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md text-stone-300 hover:bg-stone-900 hover:text-amber-500 mb-0.5 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <svg className="mr-2.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </div>
                                    {item.badge && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            {groupIndex < navigationGroups.length - 1 && (
                                <div className="my-2 border-t border-stone-800"></div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full border-t border-stone-800 p-3 bg-black">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-amber-500 hover:text-amber-400 text-xs font-medium transition-colors ml-2"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className={`${sidebarOpen ? 'md:pl-64' : ''} transition-margin duration-300 ease-in-out`}>
                <nav className="bg-black border-b border-stone-800 sticky top-0 z-20">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-14">
                            <div className="flex items-center">
                                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-stone-400 hover:text-white focus:outline-none">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Notification Bell */}
                                <NotificationDropdown
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    userType="delivery"
                                />


                                <span className="text-xs text-stone-400">Welcome, {user.name}</span>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="py-4 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>

            <ConfirmDialog />
        </div>
    );
}
