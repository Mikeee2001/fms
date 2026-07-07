import SupplierLayout from "@/Layouts/SupplierLayout";
import { Head, Link } from "@inertiajs/react";
import { ClipboardList, Eye } from "lucide-react";
import { useState } from "react";

export default function Index({ requests = [] }) {
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredRequests =
        statusFilter === "all"
            ? requests.data
            : requests.data.filter(
                (request) => request.status === statusFilter
            );

    return (
        <SupplierLayout>
            <Head title="Raw Material Requests" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        Raw Material Requests
                    </h1>

                    <p className="text-stone-400 mt-1">
                        View incoming purchase requests from managers.
                    </p>
                </div>

                {/* Status Filters */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                        "all",
                        "pending",
                        "approved",
                        "partially received",
                        "shipped",
                        "received",
                    ].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg capitalize transition ${statusFilter === status
                                ? "bg-amber-600 text-white"
                                : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-black border border-stone-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-800">
                            <thead className="bg-stone-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        PO Number
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Manager
                                    </th>

                                    {/* <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Supplier
                                    </th> */}

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Items
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Total Amount
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-sm font-semibold text-stone-300">
                                        Request Date
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold text-stone-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-800">
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-stone-900 transition"
                                        >
                                            {/* PO Number */}
                                            <td className="px-6 py-4 text-white font-medium">
                                                {request.po_number}
                                            </td>

                                            {/* Manager */}
                                            <td className="px-6 py-4 text-stone-300">
                                                {request.manager?.user?.name ??
                                                    "Unknown"}
                                            </td>

                                            {/* Supplier */}
                                            {/* <td className="px-6 py-4 text-stone-300">
                                                {request.supplier
                                                    ?.company_name ?? "-"}
                                            </td> */}

                                            {/* Items Count */}
                                            <td className="px-6 py-4 text-stone-300">
                                                {request.items?.length ?? 0}
                                            </td>

                                            {/* Total */}
                                            <td className="px-6 py-4 text-emerald-400 font-semibold">
                                                ₱
                                                {Number(
                                                    request.total_amount ?? 0
                                                ).toLocaleString()}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${request.status ===
                                                        "pending"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : request.status ===
                                                            "approved"
                                                            ? "bg-blue-500/20 text-blue-400"
                                                            : request.status ===
                                                                "shipped"
                                                                ? "bg-purple-500/20 text-purple-400"
                                                                : "bg-green-500/20 text-green-400"
                                                        }`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-stone-400">
                                                {new Date(
                                                    request.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <Link
                                                        href={route(
                                                            "supplier.raw-material-requests.show",
                                                            request.id
                                                        )}
                                                        className="p-2 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white transition"
                                                        title="View Request"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12"
                                        >
                                            <div className="text-center">
                                                <ClipboardList
                                                    size={48}
                                                    className="mx-auto text-stone-500 mb-3"
                                                />

                                                <h3 className="text-white font-medium">
                                                    No Requests Found
                                                </h3>

                                                <p className="text-stone-400 mt-1">
                                                    No purchase requests match
                                                    the selected filter.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {requests.last_page > 1 && (
                            <div className="flex justify-center items-center gap-3 border-t border-stone-800 p-4">
                                <Link
                                    href={requests.prev_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["requests"]}
                                    className={`px-4 py-2 rounded-lg ${requests.prev_page_url
                                        ? "bg-stone-900 hover:bg-stone-800 text-white"
                                        : "bg-stone-900 text-stone-600 pointer-events-none"
                                        }`}
                                >
                                    Previous
                                </Link>

                                <span className="px-4 py-2 rounded-lg bg-amber-600 text-white">
                                    {requests.current_page}
                                </span>

                                <Link
                                    href={requests.next_page_url || "#"}
                                    preserveScroll
                                    preserveState
                                    only={["requests"]}
                                    className={`px-4 py-2 rounded-lg ${requests.next_page_url
                                        ? "bg-stone-900 hover:bg-stone-800 text-white"
                                        : "bg-stone-900 text-stone-600 pointer-events-none"
                                        }`}
                                >
                                    Next
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
}
