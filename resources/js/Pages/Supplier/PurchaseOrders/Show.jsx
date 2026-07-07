import { useState } from "react";
import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useToast } from "@/Contexts/ToastContext";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    User,
    Building2,
    CreditCard,
    FileText,
    Wallet,
} from "lucide-react";

export default function Show({ purchaseOrder }) {
    const [status, setStatus] = useState(
        purchaseOrder.status
    );

    const { showToast } = useToast();

    const updateStatus = () => {
        router.patch(
            route(
                "supplier.purchase-orders.update-status",
                purchaseOrder.id
            ),
            {
                status,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    showToast(
                        "success",
                        "Success",
                        "Purchase Order status updated successfully."
                    );
                },

                onError: () => {
                    showToast(
                        "error",
                        "Error",
                        "Failed to update Purchase Order status."
                    );
                },
            }
        );
    };

    const statusColors = {
        pending:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",

        approved:
            "bg-blue-500/20 text-blue-400 border border-blue-500/30",

        shipped:
            "bg-purple-500/20 text-purple-400 border border-purple-500/30",

        received:
            "bg-green-500/20 text-green-400 border border-green-500/30",

        cancelled:
            "bg-red-500/20 text-red-400 border border-red-500/30",
    };

    return (
        <SupplierLayout>
            <Head title={`PO ${purchaseOrder.po_number}`} />

            <div className="min-h-screen bg-black py-8">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Back Button */}
                    <Link
                        href={route("supplier.raw-material.index")}
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-lg font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to Requests
                    </Link>

                    {/* Header */}
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                {purchaseOrder.po_number}
                            </h1>

                            <p className="text-stone-300 text-lg mt-2">
                                Order Date: {purchaseOrder.order_date}
                            </p>
                        </div>

                        <span
                            className={`px-5 py-2 rounded-full text-base font-bold ${statusColors[purchaseOrder.status]}`}
                        >
                            {purchaseOrder.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mt-8">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Ordered Materials */}
                            <div className="bg-stone-900 border border-stone-700 rounded-2xl shadow-xl overflow-hidden">

                                <div className="border-b border-stone-700 p-5 flex items-center gap-3">
                                    <Package className="text-indigo-400" size={24} />

                                    <h2 className="text-2xl font-bold text-white">
                                        Ordered Materials
                                    </h2>
                                </div>

                                <div className="divide-y divide-stone-700">

                                    {purchaseOrder.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-6 flex justify-between items-center"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {item.raw_material?.material_name}
                                                </h3>

                                                <p className="text-base text-stone-300 mt-1">
                                                    Unit: {item.raw_material?.unit?.name}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-lg text-stone-200">
                                                    Qty: {parseFloat(item.quantity)}
                                                </p>

                                                <p className="text-lg text-stone-200">
                                                    ₱{item.unit_price}
                                                </p>

                                                <p className="text-xl font-bold text-amber-400">
                                                    ₱{item.subtotal}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl">

                                <div className="flex items-center gap-3 mb-4">
                                    <FileText
                                        className="text-indigo-400"
                                        size={24}
                                    />

                                    <h2 className="text-2xl font-bold text-white">
                                        Notes
                                    </h2>
                                </div>

                                <p className="text-lg text-stone-200">
                                    {purchaseOrder.notes || "No notes available"}
                                </p>

                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">

                            {/* Manager */}
                            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl">

                                <div className="flex items-center gap-3 mb-4">
                                    <User
                                        className="text-blue-400"
                                        size={24}
                                    />

                                    <h2 className="text-xl font-bold text-white">
                                        Manager Information
                                    </h2>
                                </div>

                                <p className="text-lg text-stone-200 font-medium">
                                    {purchaseOrder.manager?.user?.name}
                                </p>

                            </div>

                            {/* Supplier */}
                            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl">

                                <div className="flex items-center gap-3 mb-4">
                                    <Building2
                                        className="text-green-400"
                                        size={24}
                                    />

                                    <h2 className="text-xl font-bold text-white">
                                        Supplier
                                    </h2>
                                </div>

                                <p className="text-lg text-stone-200 font-medium">
                                    {purchaseOrder.supplier?.company_name}
                                </p>

                            </div>

                            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl">

                                <div className="flex items-center gap-3 mb-4">
                                    <Wallet
                                        className="text-amber-400"
                                        size={24}
                                    />

                                    <h2 className="text-xl font-bold text-white">
                                        Purchase Order Summary
                                    </h2>
                                </div>

                                <div className="space-y-4">

                                    <div className="flex justify-between">
                                        <span className="text-lg text-stone-300">
                                            Total
                                        </span>

                                        <span className="text-lg font-semibold text-white">
                                            ₱{purchaseOrder.total_amount}
                                        </span>
                                    </div>


                                </div>

                            </div>

                            {/* Update Status */}
                            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-xl">

                                <div className="flex items-center gap-3 mb-4">
                                    <Truck
                                        className="text-purple-400"
                                        size={24}
                                    />

                                    <h2 className="text-xl font-bold text-white">
                                        Update Status
                                    </h2>
                                </div>

                                {/* Current Status */}
                                <div className="mb-4">
                                    <p className="text-stone-400 text-sm mb-2">
                                        Current Status
                                    </p>

                                    <div className="bg-black border border-stone-700 rounded-lg p-3 text-center">
                                        <span className="text-lg font-bold text-amber-400 uppercase">
                                            {purchaseOrder.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Dropdown */}
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={['shipped', 'received', 'cancelled'].includes(purchaseOrder.status)}
                                    className="w-full bg-black border border-stone-600 text-white text-lg rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {purchaseOrder.status === 'pending' && (
                                        <>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="cancelled">Cancelled</option>
                                        </>
                                    )}

                                    {purchaseOrder.status === 'approved' && (
                                        <>
                                            <option value="approved">Approved</option>
                                            <option value="shipped">Shipped</option>
                                        </>
                                    )}

                                    {['shipped', 'received', 'cancelled'].includes(purchaseOrder.status) && (
                                        <option value={purchaseOrder.status}>
                                            {purchaseOrder.status.charAt(0).toUpperCase() +
                                                purchaseOrder.status.slice(1)}
                                        </option>
                                    )}
                                </select>

                                {/* Update Button */}
                                <button
                                    onClick={updateStatus}
                                    disabled={
                                        status === purchaseOrder.status ||
                                        ['shipped', 'received', 'cancelled'].includes(purchaseOrder.status)
                                    }
                                    className={`w-full mt-4 text-lg font-bold py-4 rounded-xl transition
                                           ${status === purchaseOrder.status ||
                                            ['shipped', 'received', 'cancelled'].includes(purchaseOrder.status)
                                            ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {['shipped', 'received', 'cancelled'].includes(purchaseOrder.status)
                                        ? 'Status Locked'
                                        : status === purchaseOrder.status
                                            ? 'No Changes'
                                            : 'Update Status'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
}
