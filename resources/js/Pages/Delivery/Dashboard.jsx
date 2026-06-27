import { useState } from 'react';
import DeliveryLayout from '@/Layouts/DeliveryLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClipboardList,
    Truck,
    CheckCircle2,
    UserCheck,
    Eye,
    MapPin,
    Calendar,
    Users,
    Activity,
    AlertCircle
} from 'lucide-react';

export default function DeliveryDashboard({
    stats,
    recentDeliveries,
    personnelStatus
}) {
    // Safe fallback data defaults to guard against null/undefined layout variables
    const safeStats = stats || {
        pendingRequestsCount: 0,
        activeDeliveriesCount: 0,
        completedDeliveriesCount: 0
    };

    const safeRecentDeliveries = recentDeliveries || [];
    const safePersonnelStatus = personnelStatus || [];

    // Maps your backend Order lifecycle statuses directly to React dashboard style tokens
    const statusColors = {
        pending: 'bg-stone-900/40 text-stone-400 border border-stone-700',
        processing: 'bg-amber-900/30 text-amber-400 border border-amber-700',
        shipped: 'bg-indigo-900/30 text-indigo-400 border border-indigo-700', // Represents 'Out for Delivery'
        completed: 'bg-emerald-900/30 text-emerald-400 border border-emerald-700', // Represents 'Delivered'
        cancelled: 'bg-red-900/30 text-red-400 border border-red-700',
    };

    const personnelStatusColors = {
        available: 'bg-emerald-500/10 text-emerald-400 border-emerald-800/50',
        busy: 'bg-indigo-500/10 text-indigo-400 border-indigo-800/50',
        offline: 'bg-stone-800 text-stone-400 border-stone-700',
    };

    return (
        <DeliveryLayout>
            <Head title="Delivery Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Delivery Dashboard</h1>
                        <p className="text-stone-400">Monitor distribution workflows, dispatch assignments, and transit staff status parameters.</p>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Pending Requests (processing_orders) */}
                        <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-amber-800 transition-all group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                        <p className="text-sm font-medium text-stone-400">Pending Orders</p>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{safeStats.pendingRequestsCount}</p>
                                    <p className="text-xs text-amber-500 mt-2">Processing inside production</p>
                                </div>
                                <div className="bg-amber-900/30 rounded-xl p-3 group-hover:bg-amber-800/30 transition-colors">
                                    <ClipboardList className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                        </div>

                        {/* Active Deliveries (shipped_orders) */}
                        <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-blue-800 transition-all group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        <p className="text-sm font-medium text-stone-400">Active Shipments</p>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{safeStats.activeDeliveriesCount}</p>
                                    <p className="text-xs text-blue-500 mt-2">Shipped / out for delivery</p>
                                </div>
                                <div className="bg-blue-900/30 rounded-xl p-3 group-hover:bg-blue-800/30 transition-colors">
                                    <Truck className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Completed Deliveries (completed_orders) */}
                        <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-emerald-800 transition-all group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <p className="text-sm font-medium text-stone-400">Fulfilled Orders</p>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-500">{safeStats.completedDeliveriesCount}</p>
                                    <p className="text-xs text-stone-500 mt-2">Successful drop-offs</p>
                                </div>
                                <div className="bg-emerald-900/30 rounded-xl p-3 group-hover:bg-emerald-800/30 transition-colors">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Panels Layout Grid split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Side: Delivery Personnel Status Tracking */}
                        <div className="bg-black border border-stone-800 rounded-lg">
                            <div className="px-6 py-4 border-b border-stone-800">
                                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-emerald-500" />
                                    Personnel Fleet Overview
                                </h3>
                                <p className="text-sm text-stone-400 mt-1">Live workload allocation and roster tracking</p>
                            </div>
                            <div className="divide-y divide-stone-800">
                                {safePersonnelStatus.length > 0 ? (
                                    safePersonnelStatus.map((person) => (
                                        <div key={person.id} className="px-6 py-4 hover:bg-stone-900/30 transition-colors">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-stone-900 rounded-lg border border-stone-800">
                                                        <Users className="w-4 h-4 text-stone-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">
                                                            {person.user?.name || 'Unknown Staff'}
                                                        </p>
                                                        <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">
                                                            {person.vehicle_type || 'No Vehicle'} • <span className="text-stone-500">{person.plate_number || 'N/A'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs px-2.5 py-1 rounded-md border font-medium capitalize ${personnelStatusColors[person.status] || 'bg-stone-800 text-stone-400 border-stone-700'}`}>
                                                        {person.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-12 text-center text-stone-500 text-sm">
                                        No delivery personnel profiles configured.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Recent Deliveries List */}
                        <div className="bg-black border border-stone-800 rounded-lg">
                            <div className="px-6 py-4 border-b border-stone-800">
                                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-indigo-400" />
                                    Recent Dispatches
                                </h3>
                                <p className="text-sm text-stone-400 mt-1">Latest physical delivery schedules tracked</p>
                            </div>
                            <div className="divide-y divide-stone-800">
                                {safeRecentDeliveries.length > 0 ? (
                                    safeRecentDeliveries.map((delivery) => {
                                        // Pull the true order status string directly from your backend array rules
                                        const currentStatus = delivery.order?.status || 'pending';

                                        // Readable conversion logic for custom strings
                                        let statusLabel = currentStatus.replace('_', ' ');
                                        if (currentStatus === 'shipped') statusLabel = 'Out For Delivery';
                                        if (currentStatus === 'completed') statusLabel = 'Delivered';

                                        return (
                                            <div key={delivery.id} className="px-6 py-4 hover:bg-stone-900/30 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 p-2 bg-stone-900 rounded-lg border border-stone-800">
                                                            <MapPin className="w-4 h-4 text-stone-400" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-medium text-white">
                                                                    Order #{delivery.order?.order_number || delivery.order_id}
                                                                </p>
                                                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize tracking-wide ${statusColors[currentStatus] || 'bg-stone-800 text-stone-300'}`}>
                                                                    {statusLabel}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                                                                <UserCheck className="w-3 h-3 text-stone-500" />
                                                                Driver: {delivery.delivery_personnel?.user?.name || 'Unassigned'}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mt-1.5">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>Scheduled: {delivery.deliver_date ? new Date(delivery.deliver_date).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <Link
                                                        href={`/admin/deliveries/${delivery.id}/edit`}
                                                        className="text-amber-500 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors self-start"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Manage
                                                    </Link> */}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-6 py-12 text-center text-stone-500 text-sm">
                                        No active or recent deliveries on record.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </DeliveryLayout>
    );
}
