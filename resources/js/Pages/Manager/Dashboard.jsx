import ManagerLayout from '@/Layouts/ManagerLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ShoppingCart,
    Package,
    AlertTriangle,
    ClipboardList,
    Factory,
} from 'lucide-react';

export default function Dashboard() {

    const {
        totalSuppliers = 0,
        totalPurchaseOrders = 0,
        pendingPurchaseOrders = 0,
        totalRawMaterials = 0,
        lowStockMaterials = 0,
        activeMaterials = 0,
    } = usePage().props;

    return (
        <ManagerLayout>
            <Head title="Manager Dashboard" />

            <div className="space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Manager Dashboard
                    </h1>

                    <p className="text-stone-400 mt-2">
                        Welcome back! Here's an overview of purchasing, suppliers and inventory.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                    {/* Purchase Orders */}
                    <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-amber-800 transition-all group">
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm font-medium text-stone-400">Purchase Orders</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {totalPurchaseOrders}
                                </p>
                                <p className="text-xs text-stone-500 mt-2">
                                    Total purchase orders
                                </p>
                            </div>

                            <div className="bg-stone-800 rounded-xl p-3 group-hover:bg-stone-700 transition-colors">
                                <ClipboardList className="h-6 w-6 text-stone-400" />
                            </div>

                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-yellow-700 transition-all group">
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm font-medium text-stone-400">Pending Orders</p>
                                <p className="text-3xl font-bold text-yellow-500 mt-1">
                                    {pendingPurchaseOrders}
                                </p>
                                <p className="text-xs text-yellow-500 mt-2">
                                    Awaiting approval
                                </p>
                            </div>

                            <div className="bg-yellow-900/30 rounded-xl p-3 group-hover:bg-yellow-800/30 transition-colors">
                                <ShoppingCart className="h-6 w-6 text-yellow-500" />
                            </div>

                        </div>
                    </div>

                    {/* Raw Materials */}
                    <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-blue-700 transition-all group">
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm font-medium text-stone-400">Raw Materials</p>
                                <p className="text-3xl font-bold text-blue-500 mt-1">
                                    {totalRawMaterials}
                                </p>
                                <p className="text-xs text-blue-500 mt-2">
                                    Total materials
                                </p>
                            </div>

                            <div className="bg-blue-900/30 rounded-xl p-3 group-hover:bg-blue-800/30 transition-colors">
                                <Package className="h-6 w-6 text-blue-500" />
                            </div>

                        </div>
                    </div>

                    {/* Active Materials */}
                    <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-green-700 transition-all group">
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm font-medium text-stone-400">Active Materials</p>
                                <p className="text-3xl font-bold text-green-500 mt-1">
                                    {activeMaterials}
                                </p>
                                <p className="text-xs text-green-500 mt-2">
                                    Available for purchasing
                                </p>
                            </div>

                            <div className="bg-green-900/30 rounded-xl p-3 group-hover:bg-green-800/30 transition-colors">
                                <Factory className="h-6 w-6 text-green-500" />
                            </div>

                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-black border border-stone-800 rounded-lg p-5 hover:border-red-700 transition-all group">
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm font-medium text-stone-400">Low Stock</p>
                                <p className="text-3xl font-bold text-red-500 mt-1">
                                    {lowStockMaterials}
                                </p>
                                <p className="text-xs text-red-500 mt-2">
                                    Needs replenishment
                                </p>
                            </div>

                            <div className="bg-red-900/30 rounded-xl p-3 group-hover:bg-red-800/30 transition-colors">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </ManagerLayout>
    );
}
