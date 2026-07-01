import SupplierLayout from '@/Layouts/SupplierLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    HiCube,
    HiClock,
    HiCheckCircle,
    HiTruck,
} from 'react-icons/hi';

export default function Dashboard() {

    const { stats = {} } = usePage().props;

    const cards = [
        {
            title: 'Total Materials',
            value: stats.materials ?? 0,
            description: 'Raw materials you supply',
            icon: HiCube,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'New Purchase Orders',
            value: stats.newOrders ?? 0,
            description: 'Recently received from customers',
            icon: HiClock,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
        },
        {
            title: 'Pending Approval',
            value: stats.pendingOrders ?? 0,
            description: 'Orders waiting for your response',
            icon: HiCheckCircle,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
        },
        {
            title: 'Completed Deliveries',
            value: stats.completedOrders ?? 0,
            description: 'Successfully fulfilled orders',
            icon: HiTruck,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Low Stock Alerts',
            value: stats.lowStock ?? 0,
            description: 'Materials running low',
            icon: HiCube,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
        },
    ];

    
    return (
        <SupplierLayout>
            <Head title="Supplier Dashboard" />

            <h1 className="text-3xl font-bold text-white mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="border border-stone-800 rounded-xl p-5 bg-black hover:border-amber-500 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-stone-300 text-sm">
                                        {card.title}
                                    </p>

                                    <h2 className={`text-4xl font-bold mt-2 ${card.color}`}>
                                        {card.value}
                                    </h2>
                                </div>

                                <div
                                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.bg}`}
                                >
                                    <Icon className={`h-6 w-6 ${card.color}`} />
                                </div>

                            </div>

                            <p className="text-xs text-stone-500 mt-5">
                                {card.description}
                            </p>
                        </div>
                    );
                })}

            </div>
        </SupplierLayout>
    );
}
