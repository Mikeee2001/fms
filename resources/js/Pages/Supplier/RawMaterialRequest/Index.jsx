import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head } from "@inertiajs/react";
import { ClipboardList, Package, User, AlertCircle } from "lucide-react";

export default function Index({ draftRequests }) {
    return (
        <SupplierLayout>
            <Head title="Raw Material Requests" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

                {/* HEADER */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow">
                        <ClipboardList className="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Raw Material Requests
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Manage incoming purchase orders from managers
                        </p>
                    </div>
                </div>

                {/* EMPTY STATE */}
                {draftRequests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">

                        <AlertCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />

                        <h2 className="text-xl font-bold text-gray-800">
                            No Requests Yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Incoming purchase orders will appear here once managers place them.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">

                        {draftRequests.map((po) => (
                            <div
                                key={po.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100"
                            >

                                {/* TOP */}
                                <div className="flex justify-between items-start mb-4">

                                    <div className="flex gap-3">

                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <Package className="w-5 h-5 text-indigo-600" />
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-gray-900 text-lg">
                                                {po.po_number}
                                            </h2>

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <User className="w-4 h-4" />
                                                {po.manager?.user?.name ?? "Unknown"}
                                            </div>
                                        </div>

                                    </div>

                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                                        {po.status}
                                    </span>

                                </div>

                                {/* ITEMS */}
                                <div className="space-y-2 border-t pt-4">

                                    {po.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm text-gray-700"
                                        >
                                            <span className="font-medium">
                                                {item.rawMaterial?.material_name ?? "Unknown Item"}
                                            </span>

                                            <span className="text-gray-900 font-semibold">
                                                {item.quantity} × ₱{item.unit_price}
                                            </span>
                                        </div>
                                    ))}

                                </div>

                                {/* FOOTER */}
                                <div className="mt-5 flex justify-between items-center border-t pt-4">

                                    <span className="text-gray-500 text-sm">
                                        Total Amount
                                    </span>

                                    <span className="text-lg font-bold text-gray-900">
                                        ₱{po.total_amount}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </div>
        </SupplierLayout>
    );
}
